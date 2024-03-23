const validator=require("fastest-validator")
const validat=new validator()

const Schema={
    name:{
        min:4,
        max:20,
        type:"string",
        required:true
    },
    username:{
        min:4,
        max:20,
        type:"string",
        required:true,
    },
    email:{
        min:10,
        max:30,
        type:"email",
        required:true,
    },
    phone:{
        min:11,
        max:11,
        required:true,
        type:"string"
    },
    password:{
        min:8,
        max:16,
        type:"string",
        required:true
    },
    $$strict:"remove"
}

const checkUpdateUser=validat.compile(Schema)

module.exports=checkUpdateUser