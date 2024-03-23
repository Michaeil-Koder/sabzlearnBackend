const express=require("express")
const userRoutes=express.Router()
const {getMe,register,login,logout}=require("../controllers/authControllers")
const isAdmin=require("../middleware/checkAdmin")
const CheckId=require("../middleware/checkId")

// userRoutes
//     .route("/:id?")
//     .get(getMe) //One
//     .post(CheckId,register) // Create User
//     .put(CheckId,isAdmin,UpdateInform) // Update Inform User
//     .delete() // delete User
    
// userRoutes.get("/me/:id?",CheckId,getMe)
userRoutes.post("/register",register)
userRoutes.post("/logout/:id",CheckId,logout)
userRoutes.post("/login",login)

module.exports=userRoutes