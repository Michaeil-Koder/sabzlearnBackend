const newsletterModel=require("../model/newsletter")
const moment=require("moment-jalaali")





exports.getAll=async(req,res)=>{
    try{
        const newsletterGet=await newsletterModel.find({}).lean()
        res.send(newsletterGet)
    }catch(err){
        return res.status(400).send(err)
    }
}







exports.create=async(req,res)=>{
    try{
        const {email}=req.body
        const globalRegex=new RegExp("[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+",'g')
        if(!globalRegex.test(email)){
            return res.status(400).send({message:"please send email"})
        }
        const createAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const updateAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const newsletterCreate=await newsletterModel.create({email,createAt,updateAt})
        res.status(201).send(newsletterCreate)
    }catch(err){
        return res.status(400).send(err)
    }
}