const express=require("express")
const banRoutes=express.Router()
const CheckId=require("../middleware/checkId")
const banControllers=require("../controllers/banControllers")
const checkTokken = require("../middleware/checkTokken")
const checkAdmin = require("../middleware/checkAdmin")

banRoutes.post("/ban/:id",checkTokken,CheckId,checkAdmin,banControllers.banUser)


module.exports=banRoutes