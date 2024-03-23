const commentModel = require("../model/Comment")
const courseModel = require("../model/Course")
const ArticleModel = require("../model/Article")
const moment = require("moment-jalaali")
const check = require("../validator/commentValidator")

const newComment = async (req, res) => {
    try {
        const { id, body, score, isAnswer, mainCommentID } = req.body
        const createAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const updateAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")

        const checkComment = check({ body, score, isAnswer, mainCommentID })

        if (checkComment !== true) {
            return res.status(422).send(checkComment)
        }


        const course = await courseModel.findOne({ href: req.params.href }, "_id")
        let article=await ArticleModel.findOne({ href: req.params.href }, "_id")
        
        if(!article&&!course){
            return res.status(404).send({message:"این صفحه یافت نشد"})
        }
        if (!isAnswer) {
            await commentModel.create({ body, course,article, score, creator: id, updateAt, createAt })
            return res.send({ message: "Comment Sabt Shod" })
        }
        await commentModel.create({ body, course,article, score, creator: id, isAnswer, mainCommentID, updateAt, createAt })
        return res.send({ message: "Comment Sabt Shod" })

    } catch (err) {
        return res.status(err.status || 400).send(err)
    }
}

const getComments = async (req, res) => {
    try {
        const course = await courseModel.findOne({ href: req.params.href }, "_id")
        const article = await ArticleModel.findOne({ href: req.params.href }, "_id")
        let AllComment=null
        if(course){
            AllComment = await commentModel.find({ course }, "body score isAccept isAnswer mainCommentID").populate("creator", "username role").populate("mainCommentID", "creator").lean()
        }else if(article){
            AllComment = await commentModel.find({ article }, "body score isAccept isAnswer mainCommentID").populate("creator", "username role").populate("mainCommentID", "creator").lean()
        }else{
            return res.status(404).send({message:"این صفحه یافت نشد"})
        }

        const CommentByAnswer=[]
        AllComment.forEach(comment=>{
            const AnswerCommentArray=[]
            AllComment.forEach(AnswerComment=>{
                if(AnswerComment.isAnswer){
                    if(String(comment._id)===String(AnswerComment.mainCommentID._id)){
                        AnswerCommentArray.push(AnswerComment)
                    }
                }
            })
            if(!comment.isAnswer){
                CommentByAnswer.push({...comment,AnswerComment:AnswerCommentArray})
            }
        })
        res.send(CommentByAnswer)
    } catch (err) {
        return res.status(err.status || 400).send(err)
    }
}


const AcceptComment = async (req, res) => {
    try {
        const { id } = req.params
        const comment = await commentModel.findById(id)
        if(!comment){
            return res.status(422).send({ message: "Comment Not Found" })
        }else if (comment.isAccept) {
            return res.status(422).send({ message: "This Comment Is Accept" })
        }
        const updateAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        await commentModel.updateOne({ _id: id }, { isAccept: true, updateAt })
        res.send({ message: "Comment Is Accepted" })
    } catch (err) {
        return res.status(err.status || 400).send(err)
    }
    
}


const DelComment = async (req, res) => {
    try {
        const { id } = req.params
        const comment = await commentModel.findByIdAndDelete(id)
        if (!comment) {
            return res.send({ message: "Comment Not Found" })
        }
        res.status(200).send({message:"Delete Successfully"})
        
    } catch (err) {
        return res.status(err.status || 400).send(err)
    }

}


module.exports = {
    newComment,
    getComments,
    AcceptComment,
    DelComment,
}