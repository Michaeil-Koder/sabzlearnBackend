const mongoose=require("mongoose")
require("dotenv").config()
mongoose.connect(process.env.url)

const banSchema=new mongoose.Schema({
    userID:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },
    phone:{
        minLength:11,
        maxLength:11,
        type:String,
    },
    email:{
        minLength:10,
        maxLength:30,
        type:String,
    },
    createAt:{
        type:String,
    },
    updatedAt:{
        type:String,
    },
})

const banModel=mongoose.model("banUser",banSchema)


module.exports={
    banModel,
}