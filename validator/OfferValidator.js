const validator=require("fastest-validator")
const validat=new validator()
const schema={
    code:{
        type:"string",
        required:true
    },
    courseID:{
        type:"string",
        required:true
    },
    percent:{
        type:"number",
        max:100,
        min:0,
        required:true
    },
    max:{
        type:"number",
        required:true,
    },
    timeFinish:{ //Day
        type:"number",
        required:true,
    },
}
const check=validat.compile(schema)

module.exports=check