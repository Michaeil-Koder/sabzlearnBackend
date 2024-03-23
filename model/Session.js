const mongoose=require("mongoose")
require("dotenv").config()
mongoose.connect(process.env.url)

const schema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    free:{
        type:Boolean,
        required:true
    },
    video:{
        type:String,
        required:true
    },
    course:{
        type:mongoose.Types.ObjectId,
        ref:"Course",
        required:true
    },
    createAt:{
        type:String,
    },
    updateAt:{
        type:String,
    },
})


const model=mongoose.model("Session",schema)

module.exports=model