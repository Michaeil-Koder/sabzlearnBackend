const validator=require("fastest-validator")
const validat=new validator()
const schema={
    title:{
        type:"string",
        required:true
    },
    time:{
        type:"string",
        required:true
    },
    course:{
        type:"string",
        required:true
    },
    free:{
        type:"boolean",
        required:true
    },
}
const check=validat.compile(schema)

module.exports=check