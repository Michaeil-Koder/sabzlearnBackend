const express = require("express")
const routes = express.Router()
const courseControllers = require("../controllers/courseControllers")
const checkTokken = require("../middleware/checkTokken")
const checkAdmin = require("../middleware/checkAdmin")
const checkBodyId = require("../middleware/checkBodyId")
const upload = require("../utils/uploader")
const checkTeacherAndAdmin = require("../middleware/checkTeacherAndAdmin")
const checkId = require("../middleware/checkId")

routes.route("/").get(courseControllers.vercel)
routes.route("/popular").get(courseControllers.popularCourse)
routes.route("/preSell").get(courseControllers.preSellCourse)

routes
    .route("/:href?")
    .post(checkTokken, checkId, checkAdmin, upload.fields([
        { name: 'cover', maxCount: 1 },
        { name: 'banner', maxCount: 1 }
    ]), courseControllers.create)
    .get(checkTokken, courseControllers.getOne)

routes.route("/:href/relateCourse").get(courseControllers.RelatedCourses)

routes.route("/:href/register").post(checkTokken, checkId, courseControllers.register)

routes.route("/:id").delete(checkTokken, checkAdmin, checkId, courseControllers.remove)

routes.route("/:href/:sessionID").get(checkBodyId, courseControllers.getSession)



module.exports = routes