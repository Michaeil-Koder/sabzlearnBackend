require("dotenv").config()
const moment = require("moment-jalaali")
const { userModel, mongoose } = require("../model/User")
const { banModel } = require("../model/Ban")
const check = require("../validator/registerValidator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const checkUpdateInform = require("../validator/updateUserValidator")
const checkAdminUpdate = require("../validator/AdminUpdateValidator")

const register = async (req, res) => {
    try {
        const newUser = req.body
        const checkBody = check(newUser)
        const { username, email, phone } = newUser
        if (checkBody !== true) {
            return res.status(422).send(checkBody)
        }
        // Check User Is Ban
        const isBanUser = await banModel.findOne({
            $or: [{ email }, { phone }]
        })
        if (isBanUser) {
            return res.status(409).json({ message: "email or phone Is Ban" })
        }
        // Check User Is There In DB
        const checkUserExists = await userModel.findOne({
            $or: [{ username }, { email }, { phone }]
        })
        if (checkUserExists) {
            return res.status(409).json({ message: "email or username or phone Is There" })
        }

        // Create User

        const salt = bcrypt.genSaltSync()
        const pasHash = bcrypt.hashSync(newUser.password, salt)
        newUser.password = pasHash
        const createAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const updatedAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const countOfUser = await userModel.countDocuments()
        const User = await userModel.create({ ...newUser, role: countOfUser > 0 ? "USER" : "ADMIN", createAt, updatedAt })
        const UserObject = User.toObject()
        delete UserObject._id
        delete UserObject.password
        const accessToken = jwt.sign({ id: User._id }, process.env.JWT_SECREAT, {
            expiresIn: "30 day"
        })
        res.send({ User: UserObject, accessToken })
    } catch (err) {
        res.send(err)
    }
}

const login = async (req, res) => {
    try{
        const {identifier,password}=req.body
        const resualtFind=await userModel.findOne({
            $or:[{username:identifier},{email:identifier},{phone:identifier}]
        })
        
        if(!resualtFind){
            return res.status(409).send({message:"User Not Found"})
        }else if(resualtFind.logIn===true){
            return res.status(410).send({message:"User Is LogIn"})
        }

        const checkPass=bcrypt.compareSync(password,resualtFind.password)
        if(!checkPass){
            return res.status(400).send({message:"Password Incorrect"})
        }
    
        await userModel.findByIdAndUpdate(resualtFind.id,{logIn:true})

        const accessToken=jwt.sign({id:resualtFind.id},process.env.JWT_SECREAT,{
            expiresIn:"30 day"
        })

        res.send({message:"Login Successfully",accessToken})
    }catch(err){
        res.send(err)
    }
}



const logout = async (req, res) => {
    try {
        const { id } = req.params
        const isThereUser=await userModel.findById(id)
        if(!isThereUser){
            return res.status(409).send({message:"This User Not Found"})
        }
        // Check User Is Ban
        const isBanUser = await banModel.findOne({userID:id})
        if (isBanUser) {
            return res.status(409).json({ message: "User Is Ban" })
        }

        if(isThereUser.logIn===false){
            return res.status(420).send({message:"User LogOut"})
        }

        const updatedAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")

        await userModel.findByIdAndUpdate(id,{logIn:false ,updatedAt})
        res.status(200).send({message:"User LogOut Successfully"})
    }catch(err){
        res.send(err)
    }
}


// // switch case USER And TEACHER
// const userTeacherUpdate = async (req, res,findUser) => {
//     try {
//         const {id}=req.body
//         const { username = findUser.username, email = findUser.email, password = findUser.password , role , logIn} = req.body
//         if(role || logIn){
//             return res.status(308).send({message:"You Are Not ADMIN"})
//         }
//         const checkBodyUpdate = checkUpdateInform({ username, email, password })
//         if (checkBodyUpdate === true) {

//             if (password !== findUser.password) {
//                 const compareHash = bcrypt.compareSync(password, findUser.password)
//                 if (compareHash) {
//                     return res.status(305).send({ message: "Please Enter The New Password" })
//                 }
//                 const newSalt = bcrypt.genSaltSync()
//                 const newHashPas = bcrypt.hashSync(password, newSalt)
//                 await userModel.findByIdAndUpdate(id, { username, email, password: newHashPas })
//                 return res.status(200).send({ message: "Update Successfully" })
//             }
//             await userModel.findByIdAndUpdate(id, { username, email })
//             return res.status(200).send({ message: "Update Successfully" })
//         } else {
//             return res.status(302).send(checkBodyUpdate)
//         }
//     }
//     catch (err) {
//         res.status(503).send(err)
//     }
// }

// const UpdateInform = async (req, res) => {
//     try {
//         const { id } = req.body
//         const findUser = await userModel.findById(id)
//         if (!findUser) {
//             return res.status(404).send({ message: "This User Not Found" })
//         }
//         switch (req.body.impress) {
//             case "ADMIN":
//                 const { role = findUser.role, logIn = JSON.parse(findUser.logIn) } = req.body
//                 const isValidBody=checkAdminUpdate({role,logIn})

//                 if (isValidBody!==true) {
//                     return res.status(301).json(isValidBody)
//                 }
//                 if (findUser.role === "ADMIN") {
//                     return res.status(302).json({ message: "This Is Admin" })
//                 } else if (findUser.role === "BAN") {
//                     if (role !== "BAN") {
//                         await userModel.findByIdAndUpdate(id, { role })
//                         return res.status(200).send({ message: "User Exit Ban" })
//                     }
//                     return res.status(200).send({ message: "User Is Ban" })
//                 }
//                 await userModel.findByIdAndUpdate(id, { role, logIn })
//                 res.status(200).send({ message: `user role is ${role} And logIn is ${logIn}` })
//                 break;
//             case "USER":
//                 await userTeacherUpdate(req,res,findUser)
//                 break;
//             case "TEACHER":
//                 await userTeacherUpdate(req,res,findUser)
//                 break;
//             case "BAN":
//                 res.status(309).send({message:"User Is A BAN"})
//                 break;

//             default:
//                 res.status(500).send({ message: "Sorry About This" })
//                 break;
//         }
//     }
//     catch (err) {
//         res.status(err.status).send(err)
//     }
// }

module.exports = {
    register,
    login,
    logout,
    // UpdateInform,
}