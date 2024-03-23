const courseModel=require("../model/Course")



exports.get=async(req,res)=>{
    try{
        const {keyword}=req.params
        const courses=await courseModel.find({
            $or:[
                {name:{$regex:".*"+keyword+".*"}},
                {description:{$regex:".*"+keyword+".*"}}
            ]
        }).lean()
        const CommentByAnswer = []// dakhl Halghe ma answer ra Dakhel Comment Asli Migozarim
        courses.forEach(course => {
            course.Comments.forEach(comment => {
                const informAnswerComment = []
                if (String(course._id) === String(comment.course)) {
                    course.Comments.forEach(AnswerComment => {
                        if (AnswerComment.isAnswer) {
                            if (String(comment._id) === String(AnswerComment.mainCommentID)){
                                informAnswerComment.push(AnswerComment)
                            }
                        }
                    })
                }
                if(!comment.isAnswer){
                    console.log(comment);
                    CommentByAnswer.push({...comment,AnswerComment:informAnswerComment})
                }
            })
            course.Comments=[]
            CommentByAnswer.forEach(commentAnswer=>{
                if(String(course._id)===String(commentAnswer.course)){
                    course.Comments.push(commentAnswer)
                }
            })
        })
        courses.Comments = CommentByAnswer
        res.send(courses)
    }catch(err){
        return res.status(400).send(err)
    }
}