const express=require("express")
const userRoutes=express.Router()
const CheckId=require("../middleware/checkId")
const userControllers=require("../controllers/userControllers")
const checkTokken = require("../middleware/checkTokken")
const checkAdmin = require("../middleware/checkAdmin")
const checkTeacherAndAdmin= require("../middleware/checkTeacherAndAdmin")

userRoutes.get("/:id?",checkTokken,CheckId,checkAdmin,userControllers.getMe)
userRoutes.put("/role/:id",checkTokken,CheckId,checkAdmin,userControllers.changeRole)
userRoutes.put("/update/",checkTokken,CheckId,userControllers.UpdateUser)
userRoutes.delete("/delete/:id",checkTokken,CheckId,checkTeacherAndAdmin,userControllers.remUser)


module.exports=userRoutes