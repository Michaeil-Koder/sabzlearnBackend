const mongoose=require("mongoose")
require("dotenv").config()
mongoose.connect(process.env.url)

const schema=new mongoose.Schema({
    body:{
        type:String,
        required:true
    },
    creator:{
        type:mongoose.Types.ObjectId,
        ref:"users",
        required:true
    },
    course:{
        type: mongoose.Types.ObjectId,
        ref: "Course",
    },
    article:{
        type: mongoose.Types.ObjectId,
        ref: "article"
    },
    isAccept:{
        type:Boolean,
        default:false
    },
    score:{
        type:Number,
        minLength:1,
        maxLength:5,
        default:5
    },
    isAnswer:{//کامنت اصلی یا فرعی
        type:Boolean,
        default:false,
    },
    mainCommentID:{
        type:mongoose.Types.ObjectId,
        ref:"Comments",
        required:false
    },
    createAt:{
        type:String,
    },
    updateAt:{
        type:String,
    },
})


const model=mongoose.model("Comments",schema)

module.exports=model