const express=require("express")
const router=express.Router()
const articleControllers = require("../controllers/articleControllers")
const checkTokken = require("../middleware/checkTokken")
const checkAdmin = require("../middleware/checkAdmin")
const checkBodyId = require("../middleware/checkBodyId")
const upload = require("../utils/uploader")
const checkTeacherAndAdmin = require("../middleware/checkTeacherAndAdmin")
const checkId = require("../middleware/checkId")

router.route("/")
    .get(articleControllers.getAll)
    .post(checkTokken,checkId,checkTeacherAndAdmin,upload.single("cover"),checkTokken,checkBodyId,articleControllers.create)

router.route("/:href")
    .get(articleControllers.getOne)

    router.route("/:id")
    .delete(checkTokken,checkId,checkTeacherAndAdmin,checkBodyId,articleControllers.remove)

    router.route("/edit:id")
    .put(checkTokken,checkId,checkTeacherAndAdmin,checkBodyId,articleControllers.editBody)

module.exports=router