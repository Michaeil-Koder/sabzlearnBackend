const express = require("express")
const routes = express.Router()
const newsletterControllers = require("../controllers/newsletterControllers")
const checkTokken = require("../middleware/checkTokken")
const checkAdmin = require("../middleware/checkAdmin")
const checkId = require("../middleware/checkId")


routes.route("/")
    .get(checkTokken,checkId,checkAdmin,newsletterControllers.getAll)
    .post(newsletterControllers.create)


module.exports=routes