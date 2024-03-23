const express=require("express")
const server=express()
require("dotenv").config()
const cors=require("cors")


server.use(express.json())
server.use(express.urlencoded({extended:false}))




// middleware
server.use(cors())

// routes
const authRoutes=require("./routes/auth")
const banRoutes=require("./routes/banRoutes")
const userRoutes=require("./routes/userRoutes")
const categoryRoutes=require("./routes/categoryRoutes")
const courseRoutes=require("./routes/courseRoutes")
const sessionRoutes=require("./routes/sessionRoutes")
const commentRoutes=require("./routes/commentRoutes")
const contactRoutes=require("./routes/contactRoutes")
const newsletterRoutes=require("./routes/newsletterRoutes")
const searchRoutes=require("./routes/searchRoutes")
const notificationRoutes=require("./routes/notificationRoutes")
const offerRoutes=require("./routes/offerRoutes")
const articleRoutes=require("./routes/articleRoutes")



// api users
server.use("/sabzlearn/users",authRoutes,banRoutes,userRoutes)
server.use("/category",categoryRoutes)
server.use("/course",courseRoutes)
server.use("/session",sessionRoutes)
server.use("/comment",commentRoutes)
server.use("/contact",contactRoutes)
server.use("/newsletters",newsletterRoutes)
server.use("/search",searchRoutes)
server.use("/notification",notificationRoutes)
server.use("/offers",offerRoutes)
server.use("/article",articleRoutes)







server.use((err,req,res,next)=>{
    return res.status(err.status || 400).send({
        status:err.status || 400,
        statusMessage:err.message || "Server Error"
    })
})


server.listen(process.env.port,()=>{
    console.log(`Server Running To Port ${process.env.port}`);
})