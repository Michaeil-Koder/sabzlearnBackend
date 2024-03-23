const jwt=require("jsonwebtoken")
require("dotenv").config()



const checkTokken=async(req,res,next)=>{
    try{
        const authHeader=req.header("Authorization")?.split(" ")
        if(authHeader?.length!==2){
            return next()
        }
        const idTokken=jwt.verify(authHeader[1],process.env.JWT_SECREAT)
        req.body.id=idTokken.id
        next()
    }catch(err){
        res.status(400).send(err)
    }
}


module.exports=checkTokken