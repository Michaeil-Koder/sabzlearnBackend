const validator=require("fastest-validator")
const validat=new validator()
const schema={
    name:{
        type:"string",
        required:true
    },
    support:{
        type:"string",
        required:true
    },
    href:{
        type:"string",
        required:true
    },
    status:{
        type: "array",
        items: 'string',
        convert: true,
        enum: ["پیش فروش", "در حال برگذاری", "اتمام دوره"],
        required:true
    },
    disCount:{
        type:"number",
        required:true
    },
    price:{
        type:"number",
        required:true
    },
    description:{
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