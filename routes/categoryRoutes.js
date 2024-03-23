const express=require("express")
const routes=express.Router()
const CheckId=require("../middleware/checkId")
const categoryControllers=require("../controllers/categoryControllers")
const checkTokken = require("../middleware/checkTokken")
const checkAdmin = require("../middleware/checkAdmin")
const checkTeacherAndAdmin= require("../middleware/checkTeacherAndAdmin")

routes
    .route("/")
    .post(checkTokken,CheckId,checkAdmin,categoryControllers.create)
    .get(categoryControllers.getAll)


routes
    .route("/:id")
    .put(checkTokken,CheckId,checkAdmin,categoryControllers.update)
    .delete(checkTokken,CheckId,checkAdmin,categoryControllers.remove)

routes.route("/:href").get(categoryControllers.course_cat)

module.exports=routes