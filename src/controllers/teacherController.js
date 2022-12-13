const teacherModel = require("../models/teacherModel");
const dataValidation = require("../validations/dataValidation");
const bcrypt = require('bcryptjs');
const jwt= require("jsonwebtoken")

const createTeacher = async function (req, res) {
    try {

        let data = req.body
        if(Object.values(data).length==0) return res.status(400).send({ status: false, message: "data must be present" });

        // using destructuring of body data.
        const { fname, lname, email, password } = data;

        if(!dataValidation.isValidName(fname)) return res.status(400).send({ status: false, message: "fname should be string" });

        if(!dataValidation.isValidName(lname)) return res.status(400).send({ status: false, message: "lname should be string" });

        const validEmail= dataValidation.isValidEmail(email)
        if(validEmail) return res.status(400).send({ status: false, message: validEmail });

        const isEmailUnique = await teacherModel.findOne({ email });
        if (isEmailUnique) {
            return res.status(400).send({ status: false, message: `email: ${email} already exist` });
        }
        const validPass= dataValidation.isValidpass(password)
        if(validPass) return res.status(400).send({ status: false, message: validPass });
        //password bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);

        //Create User data after format =>fname, lname, email, password
        const teacherData = {
            fname: fname, lname: lname, email: email,
            password: hashpassword
        };

        const createTeacher = await teacherModel.create(teacherData);
        return res.status(201).send({ status: true, message: "Teacher created successfully", data: createTeacher })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const teacherLogin = async (req, res) => {
    try {
        // using destructuring of body data.
        const data = req.body
        const { email, password } = data;

        //Input data validation
        const validEmail= dataValidation.isValidEmail(email)
        if(validEmail) return res.status(400).send({ status: false, message: validEmail });

        const isEmailPresent= await teacherModel.findOne({ email });
        if (!isEmailPresent) {
            return res.status(400).send({ status: false, message: "this email is not registered " });
        }
        const validPass= dataValidation.isValidpass(password)
        if(validPass) return res.status(400).send({ status: false, message: validPass });

        //Input data verify
        let Password = await bcrypt.compare(password, isEmailPresent.password)
        if (!Password) {
            return res.status(400).send({ status: false, message: "invalid login credentials" });
        }

        // creating JWT
        const token = jwt.sign({ teacherId: isEmailPresent._id }, "secretKey123", { expiresIn: "1h" });

        //Format of data.
        let Data = {
            teacherId: isEmailPresent._id,
            token: token
        }
        return res.status(200).send({ status: true, message: "login successfully", data: Data });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { createTeacher,teacherLogin};