const mongoose=require("mongoose")
require("dotenv").config()

mongoose.connect(process.env.url)

const schema=new mongoose.Schema({
    code:{
        type:String,
        required:true
    },
    percent:{
        type:Number,
        required:true
    },
    courseID:{
        type:mongoose.Types.ObjectId,
        ref:"Course",
        required:true
    },
    creator:{
        type:mongoose.Types.ObjectId,
        ref:"users",
        required:true
    },
    max:{
        type:Number,
        required:true,
    },
    uses:{
        type:Number,
        default:0
    },
    expireCode:{ //Day
        type:String,
        required:true,
    },
    createAt:{
        type:String,
        required:true
    },
    updateAt:{
        type:String,
        required:true
    },
})

const model=mongoose.model("offer",schema)

module.exports=model