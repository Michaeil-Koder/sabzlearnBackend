const validator = require("fastest-validator")
const validat = new validator()

const Schema = {
    title:{
        type:"string",
        required:true
    },
    body:{
        type:"string",
        required:true
    },
    description:{
        type:"string",
        required:true
    },
    href:{
        type:"string",
        required:true
    },
    category:{
        type:"string",
        required:true
    },
    publish:{
        type:"boolean",
        required:true
    },
    $$strict: true
}

let checkConcatBody=validat.compile(Schema)

module.exports = checkConcatBody