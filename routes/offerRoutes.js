const express = require("express")
const routes = express.Router()
const offerControllers = require("../controllers/offerControllers")
const checkTokken = require("../middleware/checkTokken")
const checkAdmin = require("../middleware/checkAdmin")
const checkBodyId = require("../middleware/checkBodyId")
const upload = require("../utils/uploader")
const checkTeacherAndAdmin = require("../middleware/checkTeacherAndAdmin")
const checkId = require("../middleware/checkId")


routes.route("/")
    .post(checkTokken, checkId, checkBodyId, checkTeacherAndAdmin, offerControllers.newOffer)
    .get(checkTokken, checkId, checkBodyId, checkTeacherAndAdmin, offerControllers.getAll)


routes.route("/setAll")
    .post(checkTokken, checkId, checkBodyId, checkTeacherAndAdmin, offerControllers.setAllOffer)


routes.route("/:id")
    .delete(checkTokken, checkId, checkBodyId, checkTeacherAndAdmin, offerControllers.removeOffer)

routes.route("/:code")
    .put(checkTokken, checkId, checkBodyId, offerControllers.useOffer)
module.exports = routes