const express = require("express")
const routes = express.Router()
const contactControllers = require("../controllers/contactControllers")
const checkTokken = require("../middleware/checkTokken")
const checkAdmin = require("../middleware/checkAdmin")
const checkBodyId = require("../middleware/checkBodyId")
const upload = require("../utils/uploader")
const checkTeacherAndAdmin = require("../middleware/checkTeacherAndAdmin")
const checkId = require("../middleware/checkId")


routes.route("/")
    .get(checkTokken,checkAdmin,contactControllers.getAll)
    .post(upload.fields([
        {name:"contactImage",maxCount:5},
        {name:"contactVideo",maxCount:1}
    ]),contactControllers.create)

routes.route("/answer").post(checkTokken,checkId,checkAdmin,contactControllers.Answer)
routes.route("/:id/remove").delete(checkTokken,checkId,checkAdmin,contactControllers.remove)


module.exports=routes