const ContactModel = require("../model/Contact")
const checkContactBody = require("../validator/contactValidator")
const moment = require("moment-jalaali")
const nodemailer = require("nodemailer")


const getAll = async (req, res) => {
    try {
        const Allcontact = await ContactModel.find({}).select("-__v").lean()
        res.send(Allcontact)
    } catch (err) {
        return res.status(err.status || 400).send(err)
    }
}


const create = async (req, res) => {
    try {
        const { title,
            name,
            email,
            phone,
            OrderNumber,
            body } = req.body
        const check = checkContactBody({ title, name, email, phone, OrderNumber, body })
        if (check !== true) {
            return res.status(409).send(check)
        }
        const createAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        const updateAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
        if (title === "سفارش") {
            const createRes = await ContactModel.create({ title, name, email, phone, OrderNumber, body, createAt, updateAt })
            return res.status(201).send(createRes)
        } else if (req.files.contactVideo && req.files.contactImage) {
            const filenameImage = []
            req.files.contactImage.forEach(image => {
                filenameImage.push(image.filename)
            })
            const createRes = await ContactModel.create({ title, name, email, phone, OrderNumber, video: req.files.contactVideo[0].filename, image: filenameImage, body, createAt, updateAt })
            return res.status(201).send(createRes)
        } else if (req.files.contactImage) {
            const filenameImage = []
            req.files.contactImage.forEach(image => {
                filenameImage.push(image.filename)
            })
            const createRes = await ContactModel.create({ title, name, email, phone, OrderNumber, image: filenameImage, body, createAt, updateAt })
            return res.status(201).send(createRes)
        } else if (req.files.contactVideo) {
            const createRes = await ContactModel.create({ title, name, email, phone, OrderNumber, video: req.files.contactVideo[0].filename, body, createAt, updateAt })
            return res.status(201).send(createRes)
        }
        const createRes = await ContactModel.create({ title, name, email, phone, body, createAt, updateAt })
        res.status(201).send(createRes)

    } catch (err) {
        return res.status(err.status || 400).send(err)
    }
}

const Answer = async (req, res) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "michael.zare.1382@gmail.com",
                pass: "cknh bkex lqvx bjii"
            },
        })
        const mailOptions = {
            from: "michael.zare.1382@gmail.com",
            to: req.body.email,
            subject: "pasokh shoma",
            text: req.body.answer
        }
        transporter.sendMail(mailOptions, async (err, info) => {
            try {
                if (err) {
                    return res.send(err)
                } else {
                    const updateAt = moment().format("jYYYY/jMM/jDD HH:mm:ss")
                    const contact = await ContactModel.findOneAndUpdate({ email: req.body.email }, { answer: true, updateAt })
                    return res.send(info)
                }
            } catch (error) {
                return res.status(400).send(error)
            }
        })
    } catch (err) {
        return res.status(err.status || 400).send(err)
    }
}


const remove = async (req, res) => {
    try {
        const findAndDelete = await ContactModel.findByIdAndDelete(req.params.id)
        if (!findAndDelete) {
            return res.status(403).send({ message: "This Contact Not Found" })
        }
        res.status(200).send({ message: "Remove Successfully" })
    } catch (err) {
        return res.status(err.status || 400).send(err)
    }
}





module.exports = {
    getAll,
    create,
    Answer,
    remove
}