const ArticleModel = require("../model/Article")
const CommentModel = require("../model/Comment")
const check = require('../validator/articleValidator')
const express=require("express")

const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');

const deleteImg = async (req) => {
    if (req.file) {
        const imagePath = path.resolve(__dirname, '..', req.file.path);
        try {
            await fsPromises.unlink(`${imagePath}`);
        } catch (err) {
            console.log(err);
        }

    }
};


exports.getAll = async (req, res) => {
    try {
        const articleAll = await ArticleModel.find().lean()
        if (!articleAll.length) {
            return res.status(404).send({ message: "مقاله ای یافت نشد" })
        }
        const CommentByAnswer = []// dakhl Halghe ma answer ra Dakhel Comment Asli Migozarim
        articleAll.forEach(article => {
            article.Comments.forEach(comment => {
                const informAnswerComment = []
                if (String(article._id) === String(comment.article)) {
                    article.Comments.forEach(AnswerComment => {
                        if (AnswerComment.isAnswer) {
                            if (String(comment._id) === String(AnswerComment.mainCommentID)){
                                informAnswerComment.push(AnswerComment)
                            }
                        }
                    })
                }
                if(!comment.isAnswer){
                    console.log(comment);
                    CommentByAnswer.push({...comment,AnswerComment:informAnswerComment})
                }
            })
            article.Comments=[]
            CommentByAnswer.forEach(commentAnswer=>{
                if(String(article._id)===String(commentAnswer.article)){
                    article.Comments.push(commentAnswer)
                }
            })
        })
        articleAll.Comments = CommentByAnswer
        res.send(articleAll)
    } catch (err) {
        return res.status(err.status || 400).send(err.message || { message: "مشکلی رخ داده" })
    }
}




exports.create = async (req, res) => {
    try {
        const {title, body, description, href, category, publish ,id } = req.body
        let publishBol = JSON.parse(publish)
        const checkArt = check({title, body, description, href, category, publish: publishBol })
        if (checkArt !== true) {
            await deleteImg(req)
            return res.status(400).send(checkArt)
        }
        const newArticle = await ArticleModel.create({title, body, description, cover: req.file.filename, href, category, creator: id, publish: publishBol })
        res.status(201).send(newArticle)
    } catch (err) {
        await deleteImg(req)
        return res.status(err.status || 400).send(err.message || { message: "مشکلی رخ داده" })
    }
}



exports.getOne = async (req, res) => {
    try {
        const { href }=req.params
        const article=await ArticleModel.findOne({href})
        if(!article){
            return res.status(404).send({message:"این صفحه یافت نشد"})
        }
        const Comments = article.comments

        let CommentByAnswer = []// dakhl Halghe ma answer ra Dakhel Comment Asli Migozarim
        Comments.forEach(comment => {
            let informAnswerComment = []
            Comments.forEach(AnswerComment => {
                if (AnswerComment.isAnswer) {
                    if ((comment._id).toString() === (AnswerComment.mainCommentID).toString()) {
                        informAnswerComment.push(AnswerComment)

                    }
                }
            })
            if (!comment.isAnswer) {
                CommentByAnswer.push({ ...comment, AnswerComment: informAnswerComment })
            }
        })
        article.comments = CommentByAnswer
        res.send(article)
    } catch (err) {
        return res.status(err.status || 400).send(err.message || { message: "مشکلی رخ داده" })
    }
}




exports.remove = async (req, res) => {
    try {
        const {id}=req.params
        const article=await ArticleModel.findById(id)
        if(!article){
            return res.status(404).send({message:"این مقاله یافت نشد"})
        }
        const coverPath=path.join(__dirname,"../public/courses_Articles/covers",article.cover)
        await fs.rmSync(coverPath)
        await CommentModel.deleteMany({article:id})
        await ArticleModel.findByIdAndDelete(id)
        res.send({message:"مقاله با موفقیت حذف شد"})
    } catch (err) {
        return res.status(err.status || 400).send(err.message || { message: "مشکلی رخ داده" })
    }
}



exports.editBody = async (req=express.request, res=express.response) => {
    try {
        const {id}=req.params
        const {body}=req.body
        const findArticle=await ArticleModel.findById(id)
        if(!findArticle){
            return res.status(404).send({message:"این مقاله یافت نشد"})
        }else if(body.length===0){
            return res.status(404).send({message:"تغییری ایجاد نشد"})
        }
        await ArticleModel.findByIdAndUpdate(id,{body,updatedAt:new Date()})
        res.send({message:"edit successfully"})
    } catch (err) {
        return res.status(err.status || 400).send(err.message || { message: "مشکلی رخ داده" })
    }
}
