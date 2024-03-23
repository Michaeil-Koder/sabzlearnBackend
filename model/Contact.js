const mongoose=require("mongoose")
require("dotenv").config()
mongoose.connect(process.env.url)

const schema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    phone:{
        type:String,
        unique:true,
        minLength:11,
        maxLength:11,
        required:true
    },
    OrderNumber:{
        type:String,
        unique:true,
    },
    body:{
        type:String,
        required:true
    },
    video:{
        type:String,
    },
    image:{
        type:Array,
    },
    answer:{
        type:Boolean,
        default:false
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

const ContactModel=mongoose.model("contact",schema)

module.exports=ContactModel