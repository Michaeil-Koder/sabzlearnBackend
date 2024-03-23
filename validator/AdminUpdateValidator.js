const validator = require("fastest-validator")
const validat = new validator()

const Schema = {
    logIn: {
        type: "boolean",
    },
    role: {
        type: "array",
        items: 'string',
        convert: true,
        enum: ["ADMIN", "USER", "TEACHER"]
    },
    $$strict: true
}

const checkAdminUpdate = validat.compile(Schema)

module.exports = checkAdminUpdate