const express = require("express")
const routes = express.Router()
const notificationControllers = require("../controllers/notificationControllers")
const checkTokken = require("../middleware/checkTokken")
const checkAdmin = require("../middleware/checkAdmin")
const checkBodyId = require("../middleware/checkBodyId")
const upload = require("../utils/uploader")
const checkTeacherAndAdmin = require("../middleware/checkTeacherAndAdmin")
const checkId = require("../middleware/checkId")


routes.route("/")
    .post(checkTokken,checkId,checkBodyId,checkTeacherAndAdmin,notificationControllers.create)
    .get(checkTokken,checkId,checkBodyId,checkTeacherAndAdmin,notificationControllers.getAll)

routes.route("/getNotif")
    .get(checkTokken,checkId,checkTeacherAndAdmin,notificationControllers.getOne)


routes.route("/:id/see")
    .put(checkTokken,checkId,checkTeacherAndAdmin,notificationControllers.seen)
routes.route("/:id/remove")
    .delete(checkTokken,checkId,checkTeacherAndAdmin,notificationControllers.remove)


module.exports=routes