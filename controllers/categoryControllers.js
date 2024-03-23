const moment = require("moment-jalaali")
const categoryModel = require("../model/Category")
const courseModel = require("../model/Course")



const create = async (req, res) => {
    try {
        const { title, href } = req.body
        if(!title||!href){
            return res.status(422).send({message:"Please Send title And href"})
        }
        const newCategory = await categoryModel.create({ title, href })
        res.send(newCategory)
    }
    catch (err) {
        res.send(err)
    }
}


const getAll = async (req, res) => {
    try {
        const GetCategory=await categoryModel.find({}).lean()
        if(!GetCategory){
            return res.status(409).send({message:"Please first create Category"})
        }
        res.send(GetCategory)
    }
    catch (err) {
        res.send(err)
    }
}



const update = async (req, res) => {
    try {
        const {id}=req.params
        const {title,href}=req.body
        const resUpdate=await categoryModel.findByIdAndUpdate(id,{title,href})
        if(!resUpdate){
            return res.status(409).json({message:"Category Id Not Found"})
        }
        res.send(resUpdate)
    }
    catch (err) {
        res.send(err)
    }
}




const remove = async (req, res) => {
    try {
        const {id}=req.params
        const resRemove=await categoryModel.findByIdAndDelete(id)
        if(!resRemove){
            return res.status(409).json({message:"Category Id Not Found"})
        }
        res.send(resRemove)
    }
    catch (err) {
        res.send(err)
    }
}


const course_cat= async(req,res)=>{
    try{
        const findID=await categoryModel.findOne({href:req.params.href}).select("_id")
        if(!findID){
            return res.status(409).send({message:"This Category Not Found"})
        }
        const findCourseByCat= await courseModel.find({category:findID}).select("name price href status description createAt updateAt").lean()
        if(findCourseByCat.length===0){
            return res.status(422).send({message:"Not Found Course By This Category"})
        }
        res.send(findCourseByCat)
    }catch(err){
        return res.status(err.status || 400).send(err)
    }
}


module.exports = {
    getAll,
    remove,
    update,
    create,
    course_cat,
}
