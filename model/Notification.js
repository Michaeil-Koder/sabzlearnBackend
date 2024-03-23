const mongoose=require("mongoose")
require("dotenv").config()

mongoose.connect(process.env.url)

const schema=new mongoose.Schema({
    message:{
        type:String,
        required:true
    },
    adminID:{
        type:mongoose.Types.ObjectId,
        ref:"users",
        required:true
    },
    seen:{
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

const model=mongoose.model("notification",schema)

module.exports=model