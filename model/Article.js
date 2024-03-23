const mongoose=require("mongoose")
require("dotenv").config()
mongoose.connect(process.env.url)

const schema=new mongoose.Schema({
    title:{
        unique:true,
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    cover:{
        type:String,
        required:true
    },
    href:{
        unique:true,
        type:String,
        required:true
    },
    category:{
        type:mongoose.Types.ObjectId,
        ref:"category",
        required:true
    },
    creator:{
        type:mongoose.Types.ObjectId,
        ref:"users",
        required:true
    },
    publish:{
        type:Boolean,
        required:true
    },
},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})


schema.virtual("comments",{
    ref:"Comments",
    localField:"_id",
    foreignField:"article"
})

function autoPopulate(next){
    this.populate([{path:"comments",select:"-__v",match:{isAccept:true},populate:[{
        path:"creator",
        model:"users",
        select:"name role -_id",
    }]},{path:"creator",select:"name"},{path:"category",select:"title"}])
    next()
}
schema.pre("find",autoPopulate).pre("findOne",autoPopulate)

const model=mongoose.model("article",schema)
module.exports=model