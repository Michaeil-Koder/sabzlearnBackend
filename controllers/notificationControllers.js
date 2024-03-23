const notificationModel=require("../model/Notification")
const moment=require("moment-jalaali")








exports.create=async(req,res)=>{
    try{
        const {adminID , message}=req.body
        const createAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const updateAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const createNotif=await notificationModel.create({message,adminID,createAt,updateAt})
        res.status(201).send(createNotif)
    }catch(err){
        return res.status(400).send(err)
    }
}




exports.getOne=async(req,res)=>{
    try{
        const {id}=req.body
        const findNotfication=await notificationModel.find({adminID:id}).lean()
        res.send(findNotfication)
    }catch(err){
        return res.status(400).send(err)
    }
}
exports.getAll=async(req,res)=>{
    try{
        const findNotfication=await notificationModel.find({}).lean()
        res.send(findNotfication)
    }catch(err){
        return res.status(400).send(err)
    }
}




exports.seen=async(req,res)=>{
    try{
        const { id }=req.params
        const findOneNotification=await notificationModel.findByIdAndUpdate(id,{seen:true})
        if(!findOneNotification){
            return res.status(422).send({message:"Not Found Notification"})
        }else if(findOneNotification.seen){
            return res.status(422).send({message:"نوتیفیکیشن قبلا خوانده شده است."})
        }
        res.send({message:"نوتیفیکیشن خوانده شد"})
    }catch(err){
        return res.status(400).send(err)
    }
}



exports.remove=async(req,res)=>{
    try{
        const { id }=req.params
        const findOneNotification=await notificationModel.findByIdAndDelete(id)
        if(!findOneNotification){
            return res.status(422).send({message:"Not Found Notification"})
        }
        res.send({message:"نوتیفیکیشن حذف شد"})
    }catch(err){
        return res.status(400).send(err)
    }
}