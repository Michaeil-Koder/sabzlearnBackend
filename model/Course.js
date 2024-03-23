const mongoose=require("mongoose")
require("dotenv").config()
mongoose.connect(process.env.url)

const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    cover:{
        type:String,
        required:true
    },
    support:{
        type:String,
        required:true
    },
    href:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    creator:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },
    category:{
        type:mongoose.Types.ObjectId,
        ref:"category"
    },
    disCount:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
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
    createAt:{
        type:String,
    },
    updateAt:{
        type:String,
    },
},{toJSON:{virtuals:true},toObject:{virtuals:true}})

schema.virtual("Sessions",{
    ref:"Session",
    localField:"_id",
    foreignField:"course"
})
schema.virtual("Comments",{
    ref:"Comments",
    localField:"_id",
    foreignField:"course",
})

function autoPopulate(next){
    this.populate([{path:"Comments",select:"-__v",match:{isAccept:true},populate:[{
        path:"creator",
        model:"users",
        select:"name role -_id",
    }]},{path:"Sessions",select:"-__v"},{path:"creator",select:"name"},{path:"category",select:"title"}])
    next()
}
schema.pre("find",autoPopulate).pre("findOne",autoPopulate)

const model=mongoose.model("Course",schema)

module.exports=model