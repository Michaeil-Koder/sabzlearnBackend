const express = require("express")
const routes = express.Router()
const CheckId = require("../middleware/checkId")
const sessionControllers = require("../controllers/sessionControllers")
const checkTokken = require("../middleware/checkTokken")
const checkAdmin = require("../middleware/checkAdmin")
const upload = require("../utils/uploader")
const checkTeacherAndAdmin = require("../middleware/checkTeacherAndAdmin")
const checkBodyId = require("../middleware/checkBodyId")

routes
    .route("/:id?")
    .post(checkTokken,CheckId,checkTeacherAndAdmin,upload.single("video"),checkBodyId,sessionControllers.UploadSession)
    .get(checkTokken,CheckId,checkTeacherAndAdmin,sessionControllers.GetSession)
    .delete(checkTokken,CheckId,checkTeacherAndAdmin,sessionControllers.removeSession)


module.exports = routes