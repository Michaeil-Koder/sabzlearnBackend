const mongoose=require("mongoose")
mongoose.connect(process.env.url)
require("dotenv").config()

const userSchema=new mongoose.Schema({
    name:{
        minLength:4,
        maxLength:20,
        type:String,
        required:true
    },
    username:{
        minLength:4,
        maxLength:20,
        type:String,
        required:true,
        unique:true
    },
    phone:{
        minLength:11,
        maxLength:11,
        type:String,
        required:true,
        unique:true
    },
    email:{
        minLength:10,
        maxLength:30,
        type:String,
        required:true,
        unique:true
    },
    password:{
        minLength:8,
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"USER"
    },
    logIn:{
        type:Boolean,
        default:true
    },
    createAt:{
        type:String,
    },
    updatedAt:{
        type:String,
    },
})

const userModel=mongoose.model("users",userSchema)


module.exports={
    userModel,
    mongoose
}