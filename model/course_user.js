const mongoose=require("mongoose")
require("dotenv").config()
mongoose.connect(process.env.url)

const course_userSchema=new mongoose.Schema({
    courseID:{
        type:mongoose.Types.ObjectId,
        ref:"users",
        required:true
    },
    userID:{
        type:mongoose.Types.ObjectId,
        ref:"users",
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    createAt:{
        type:String,
    },
    updateAt:{
        type:String,
    },
})

const course_user=mongoose.model("course_user",course_userSchema)


module.exports=course_user
