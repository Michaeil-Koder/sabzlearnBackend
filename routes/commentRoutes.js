const express = require("express")
const routes = express.Router()
const checkId = require("../middleware/checkId")
const commentControllers = require("../controllers/commentControllers")
const checkTokken = require("../middleware/checkTokken")
const checkAdmin = require("../middleware/checkAdmin")
const upload = require("../utils/uploader")
const checkTeacherAndAdmin = require("../middleware/checkTeacherAndAdmin")
const checkBodyId = require("../middleware/checkBodyId")


routes.route("/:href").post(checkTokken,checkId,checkBodyId,commentControllers.newComment)
    .get(checkTokken,checkId,checkTeacherAndAdmin,checkBodyId,commentControllers.getComments)


routes.route("/:id")
    .put(checkTokken,checkId,checkTeacherAndAdmin,checkBodyId,commentControllers.AcceptComment)
    .delete(checkTokken,checkId,checkTeacherAndAdmin,checkBodyId,commentControllers.DelComment)

module.exports=routes