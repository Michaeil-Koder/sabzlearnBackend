const validator = require("fastest-validator")
const validat = new validator()

const Schema = {
    title:{
        type: "array",
        items: 'string',
        convert: true,
        enum:["پیشنهاد","انتقاد","سفارش"],
        required:true
    },
    name:{
        type:"string",
        required:true
    },
    email:{
        type:"email",
        required:true
    },
    phone:{
        type:"string",
        min:11,
        max:11,
        required:true
    },
    OrderNumber:{
        type:"string",
        optional:true
    },
    body:{
        type:"string",
        required:true
    },
    $$strict: true
}

let checkConcatBody=validat.compile(Schema)

module.exports = checkConcatBody