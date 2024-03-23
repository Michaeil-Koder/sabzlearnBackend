const {banModel}=require("../model/Ban")
const {userModel}=require("../model/User")
const moment = require("moment-jalaali")







const banUser=async(req,res)=>{
    try{
        const {id}=req.params
        const findUser=await userModel.findById(id).select(["phone","email" , "role"])
        if(!findUser){
            return res.status(422).send({message:"User Not Found"})
        }else if(findUser.role==="ADMIN"){
            return res.status(422).send({message:"This Is ADMIN"})
        }
        const findBanUser=await banModel.findOne({userID:id}).lean()
        if(findBanUser){
            return res.status(422).send({message:"This User Is Ban"})
        }
        const createAt=moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const updatedAt=moment().format("jYYYY/jMM/jDD HH:mm:ss")

        const {_id,phone,email}=findUser
        const ressult=await banModel.create({userID:_id,phone,email,createAt,updatedAt})
        res.status(200).send({message:"Ban User Successfully"})
    }
    catch(err){
        res.status(400).send(err)
    }
}

module.exports={banUser}