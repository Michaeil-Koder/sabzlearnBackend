require("dotenv").config()
const moment = require("moment-jalaali")
const sessionModel = require("../model/Session")
const courseModel = require("../model/Course")
const course_userModel = require("../model/course_user")
const check = require("../validator/courseValidator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { ObjectId } = require("mongodb")



const create = async (req, res) => {
    try {
        let { name,
            support,
            href,
            status,
            creator,
            category,
            disCount,
            price,
            description,
            free } = req.body


        disCount = Number(disCount)
        price = Number(price)
        free = JSON.parse(free)

        const checkCourse = check({
            name,
            support,
            href,
            status,
            creator,
            category,
            disCount,
            price,
            description,
            free
        })
        if (checkCourse !== true) {
            return res.status(422).send(checkCourse)
        }
        const createAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const updateAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const createResCourse = await courseModel.create({
            name,
            support,
            href,
            status,
            creator,
            category,
            disCount,
            price,
            description,
            free,
            cover: req.files.cover[0].filename,
            video: req.files.banner[0].filename,
            createAt,
            updateAt
        })
        res.send(createResCourse)
    } catch (err) {
        return res.status(err.status || 400).send(err)
    }
}

const getOne = async (req, res) => {
    try {
        const course = await courseModel.findOne({ href: req.params.href }).select("-cover -video -__v").lean()
        if (!course) {
            return res.status(409).send({ message: "Course Not Found" })
        }
        const Comments = course.Comments

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
        course.Comments = CommentByAnswer
        const NumOfStudent = await course_userModel.find({ courseID: course._id }).count()//Tedad Daneshjoyan
        const isUserRegisterThisCourse = !!(await course_userModel.findOne({ userID: req.body.id, courseID: course._id }))//Karbar SabtNam karde Ya Na
        res.send({ course, NumOfStudent, isUserRegisterThisCourse })

    } catch (err) {
        return res.status(err.status || 400).send(err)
    }
}


const getSession = async (req, res) => {
    try {
        const course = await courseModel.findOne({ href: req.params.href })

        const session = await sessionModel.findById(req.params.sessionID).populate("courseID", "name")
        const sessions = await sessionModel.find({ courseID: course._id }).populate("courseID", "name")
        res.send({ session, sessions })
    } catch (err) {
        return res.status(err.status || 400).send(err)
    }
}


const register = async (req, res) => {
    try {
        const courseID = await courseModel.findOne({ href: req.params.href }, "_id")

        const isAlreadyCourseUser = await course_userModel.findOne({ userID: req.body.id, courseID })
        if (isAlreadyCourseUser) {
            return res.status(409).send({ message: "User is Already In This Course" })
        } else if (!req.body.price) {
            return res.status(422).send({ message: "Please Send Price For Course" })
        }
        const createAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const updateAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const registerCourseForUser = await course_userModel.create({ userID: req.body.id, courseID, price: req.body.price, createAt, updateAt })
        res.status(201).send(registerCourseForUser)
    } catch (err) {
        return res.status(err.status || 400).send(err)
    }
}


const remove = async (req, res) => {
    try {
        const removeCourse = await courseModel.findByIdAndDelete(req.params.id)
        if (!removeCourse) {
            return res.status(409).send({ message: "Course Not Found" })
        }
        res.send({ message: "remove Successfully" })
    } catch (err) {
        return res.status(err.status || 409).send(err)
    }
}


const RelatedCourses = async (req, res) => {
    try {
        const course = await courseModel.findOne({ href: req.params.href })
        if (!course) {
            return res.status(422).send({ message: "Course Not Found" })
        }
        const RelCourse = await courseModel.find({ category: course.category._id, href: { $ne: req.params.href } }).lean()
        res.status(203).send(RelCourse)
    } catch (err) {
        return res.status(err.status || 409).send(err)
    }
}

const popularCourse = async (req, res) => {
    try {
        const courses = await courseModel.find({}).lean()

        const CommentByAnswer = []// dakhl Halghe ma answer ra Dakhel Comment Asli Migozarim
        courses.forEach(course => {
            course.Comments.forEach(comment => {
                const informAnswerComment = []
                if (String(course._id) === String(comment.course)) {
                    course.Comments.forEach(AnswerComment => {
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
            course.Comments=[]
            CommentByAnswer.forEach(commentAnswer=>{
                if(String(course._id)===String(commentAnswer.course)){
                    course.Comments.push(commentAnswer)
                }
            })
        })
        courses.Comments = CommentByAnswer
        let score = []
        courses.forEach(course => {
            let counter = 0
            let sum = 0
            course.Comments.forEach(comment => {
                if (String(comment.course) === String(course._id)) {
                    // console.log(comment);
                    sum = sum + comment.score
                    counter++
                }
            })
            const name = course.name
            const avg = sum / counter
            score.push({ name, avg })
        })
        score.sort(function (a, b) {
            return b.avg - a.avg
        });
        const courseSort = []
        score.forEach(scr => {
            courses.forEach(course => {
                if (course.name === scr.name) {
                    courseSort.push(course)
                }
            })
        })
        res.send(courseSort)
    } catch (err) {
        return res.status(err.status || 409).send(err)
    }
}

const preSellCourse=async(req,res)=>{
    try{
        const courses=await courseModel.find({}).lean()
        const preCourse=[]
        courses.forEach(course=>{
            if(course.status==="پیش فروش"){
                preCourse.push(course)
            }
        })
        res.send(preCourse)
    } catch (err) {
        return res.status(err.status || 400).send(err)
    }
}

const vercel=async(req,res)=>{
    res.send(<h1>hellow world</h1>)
}


module.exports = {
    create,
    getSession,
    register,
    getOne,
    remove,
    RelatedCourses,
    popularCourse,
    preSellCourse,
    vercel,
}