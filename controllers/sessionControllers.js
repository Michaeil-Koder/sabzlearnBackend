require("dotenv").config()
const moment = require("moment-jalaali")
const sessionModel = require("../model/Session")
const check = require("../validator/sessionValidator")

const UploadSession = async (req, res) => {
    try {
        const { title, course, time, free } = req.body
        const FreeBol = JSON.parse(free)
        const checkBody = check({ title, course, time, free: FreeBol })
        if (checkBody !== true) {
            return res.status(422).send(checkBody)
        }
        const createAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const updateAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")

        const createSession = await sessionModel.create({ title, course, time, free: FreeBol, video: req.file.filename, createAt, updateAt })
        res.send(createSession)
    } catch (err) {
        return res.status(err.status || 400).send(err)
    }
}


const GetSession=async(req,res)=>{
    try{
        const {id}=req.params
        if(id){
            const findSession=await sessionModel.findById(id,"-__v").populate("courseID","name")
            return res.send(findSession)
        }
        const findSessions=await sessionModel.find({},"-__v").populate("courseID","name").lean()
        res.send(findSessions)
    }catch(err){
        return res.status(err.status || 400).send(err)
    }
}

const removeSession=async(req,res)=>{
    try{
        const findAndRemove=await sessionModel.findByIdAndDelete(req.params.id)

        if(!findAndRemove){
            return res.status(409).send({message:"Session Not Found"})
        }
        res.send({message:"Remove Successfully"})

    }catch(err){
        return res.status(err.status||500).send(err)
    }
}


module.exports = {
    UploadSession,
    GetSession,
    removeSession
}