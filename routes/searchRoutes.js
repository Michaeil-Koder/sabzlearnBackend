const express = require("express")
const routes = express.Router()
const searchControllers = require("../controllers/searchControllers")


routes.route("/:keyword")
    .get(searchControllers.get)


module.exports=routes