const mongoose=require("mongoose")
require("dotenv").config()

mongoose.connect(process.env.url)

const schema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    href:{
        type:String,
        required:true
    }
})

const model=mongoose.model("category",schema)

module.exports=model