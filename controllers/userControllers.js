require("dotenv").config()
const moment = require("moment-jalaali")
const { userModel} = require("../model/User")
const { banModel } = require("../model/Ban")
const check = require("../validator/registerValidator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const checkUpdateInform = require("../validator/updateUserValidator")
const checkAdminUpdate = require("../validator/AdminUpdateValidator")


const getMe = async (req, res) => {
    try {
        const { id } = req.params
        if (id) {
            const findUser = await userModel.findById(id).select(["-password"])
            if (findUser) {
                res.status(200).send(findUser)
            } else {
                res.status(404).send({ message: "User Not Found" })
            }
        } else {
            const findAllUser = await userModel.find({}).select(["-password"]).lean()
            if (findAllUser.length > 0) {
                res.status(200).send(findAllUser)
            } else {
                res.status(404).send({ message: "User Not Create In DataBase" })
            }
        }
    } catch (err) {
        res.send(err)
    }
}


// Update User
const UpdateUser = async (req, res) => {
    try {
        const {id, username, email, password, phone,name} = req.body
        const checkBodyUpdate = checkUpdateInform({ username, email, password , phone,name})
        if (checkBodyUpdate === true) {
            const newSalt = bcrypt.genSaltSync()
            const newHashPas = bcrypt.hashSync(password, newSalt)
            
            const updatedAt=moment().format("jYYYY/jMM/jDD HH:mm:ss")
            
            const resualt=await userModel.findByIdAndUpdate(id, {name , username,phone, email, password: newHashPas ,  updatedAt})
            if(!resualt){
                return res.status(409).send({ message: "User Not Found" })
            }
            return res.status(200).send({ message: "Update Successfully" })
        } else {
            return res.status(302).send(checkBodyUpdate)
        }
    }
    catch (err) {
        res.status(503).send(err)
    }
}

const changeRole = async (req, res) => {
    try {
        const { id } = req.params
        const findUser = await userModel.findById(id)
        if (!findUser) {
            return res.status(404).send({ message: "This User Not Found" })
        }
        const { role = findUser.role, logIn = JSON.parse(findUser.logIn) } = req.body
        const isValidBody=checkAdminUpdate({role,logIn})

        if (isValidBody!==true) {
            return res.status(301).json(isValidBody)
        }
        if (findUser.role === "ADMIN") {
            return res.status(302).json({ message: "This Is Admin" })
        } else if (findUser.role === "BAN") {
            if (role !== "BAN") {
                await userModel.findByIdAndUpdate(id, { role })
                return res.status(200).send({ message: "User Exit Ban" })
            }
            return res.status(200).send({ message: "User Is Ban" })
        }
        await userModel.findByIdAndUpdate(id, { role, logIn })
        res.status(200).send({ message: `user role is ${role} And logIn is ${logIn}` })
    }
    catch (err) {
        res.status(err.status).send(err)
    }
}

const remUser=async(req,res)=>{
    try{
        const {id}=req.params
        const user=await userModel.findById(id).lean()
        if(!user){
            return res.status(409).send({message:"User Not Found"})
        }else if(user.role==="ADMIN"){
            return res.status(422).send({message:"ADMIN can not delete ADMIN"})
        }
        await userModel.findByIdAndDelete(id)
        res.send({message:"User Delete Successfully"})
    }catch(err){
        return res.send(err)
    }
}

module.exports={
    getMe,
    changeRole,
    remUser,
    UpdateUser,
}
