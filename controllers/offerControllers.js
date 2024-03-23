const offerModel = require("../model/Offer")
const CourseModel = require("../model/Course")
const moment = require("moment-jalaali")
const checkOffer = require("../validator/OfferValidator")
const { disconnect } = require("mongoose")




exports.newOffer = async (req, res) => {
    try {
        const { code, percent, courseID, max, timeFinish, id } = req.body
        const check = checkOffer({ code, percent, courseID, max, timeFinish })
        if (check !== true) {
            return res.status(422).send(check)
        }
        const m = moment()
        m.add(timeFinish, "day")
        const expireCode = m.format("jYYYY/jM/jD HH:mm:ss")
        console.log(expireCode);
        const createAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const updateAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        console.log(createAt);
        const createOffer = await offerModel.create({ code, percent, courseID, creator: id, max, expireCode, createAt, updateAt })
        res.status(201).send(createOffer)
    } catch (err) {
        return res.status(err.status || 400).send(err || { message: "مشکلی رخ داده" })
    }
}


exports.useOffer = async (req, res) => {
    try {
        const { code } = req.params
        const { courseID }=req.body
        const findOffer = await offerModel.findOne({ code , courseID }).populate("courseID")
        const miladiDate=new Date(moment(findOffer?.expireCode, 'jYYYY-jMM-jDD HH:mm:ss').format('YYYY-M-D HH:mm:ss'))
        if (!findOffer) {
            return res.status(404).send({ message: "کد تخفیف یافت نشد" })
        } else if (findOffer.max === findOffer.uses) {
            return res.status(400).send({ message: "سقف استفاده از کد تخفیف تمام شده" })
        }else if(miladiDate<new Date()){
            return res.status(400).send({ message: "زمان استفاده از کد تخفیف تمام شده" })
        }
        const updateAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const useOfferResualt=await offerModel.findByIdAndUpdate(findOffer._id,{uses:findOffer.uses+1,updateAt})
        const disCount= findOffer.courseID.price*(100-findOffer.percent)/100
        res.send({"قیمت با تخفیف":disCount})
    } catch (err) {
        return res.status(err.status || 400).send(err || { message: "مشکلی رخ داده" })
    }
}



exports.getAll=async(req,res)=>{
    try{
        const findAllOffer=await offerModel.find({}).populate("creator","name").populate("courseID").lean()
        res.send(findAllOffer)
    }catch(err){
        return res.status(err.status||400).send(err||{message:"خطایی رخ داده است!"})
    }
}






exports.setAllOffer=async(req,res)=>{
    try{
        const { disCount}=req.body
        if(disCount===""){
            return res.status(400).send({message:"لطفا عدد وارد کنید"})
        }
        await CourseModel.updateMany({disCount})
        res.send({message:"Discounts set Successfully :))"})
    }catch(err){
        return res.status(err.status||400).send(err||{message:"خطایی رخ داده است!"})
    }
}






exports.removeOffer=async(req,res)=>{
    try{
        const {id}=req.params
        const remove=await offerModel.findByIdAndDelete(id)
        if(!remove){
            return res.status(422).send({message:"کد تخفیفی یافت نشد"})
        }
        res.send({message:"کد تخفیف با موفقیت حذف شد"})
    }catch(err){
        return res.status(err.status||400).send(err||{message:"خطایی رخ داده است!"})
    }
}