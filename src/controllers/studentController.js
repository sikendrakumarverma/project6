const studentModel = require("../models/studentModel");
const dataValidation = require("../validations/dataValidation");


const createStudent = async function (req, res) {
    try {

        let data = req.body
        data.marks = parseInt(data.marks)
        // let token= req.headers["x-api-key"]
        let Id = req.Id

        if (!dataValidation.isValidRequestBody) return res.status(400).send({ status: false, message: "data must be present" });

        // using destructuring of body data
        const { name, subject, marks } = data;

        if (!dataValidation.isValidName(name)) return res.status(400).send({ status: false, message: "name should be string" });
        if (!dataValidation.isValidName(subject)) return res.status(400).send({ status: false, message: "subject name should be string" });
        if (!dataValidation.isValidsMarks(marks)) return res.status(400).send({ status: false, message: "marks should be number only" });


        const existStudent = await studentModel.findOne({ name: name, subject: subject, teacherId: Id });
        if (existStudent) {
            let updatedMarks = existStudent.marks + marks
            const studenData1 = {
                name: existStudent.name,
                subject: existStudent.subject,
                marks: updatedMarks,
                teacherId: Id
            }
            let update = await studentModel.findOneAndUpdate({ name: name, subject: subject }, studenData1, { new: true })

            // this below method need extra DB call to show updated data 
            //let update = await studentModel.updateOne({ $and : [{name:name,subject:subject}] }, studenData1, { new: true })
            //let update = await studentModel.updateOne({ name: name, subject: subject }, { $set: { marks: updatedMarks } }, { new: true })
            return res.status(200).send({ status: true, message: "Student added successfully", data: update });
        }
        const studenData = {
            name: name,
            subject: subject,
            marks: marks,
            teacherId: Id
        }
        //Create student data after format =>fname, lname, email, password
        const creates = await studentModel.create(studenData);
        return res.status(201).send({ status: true, message: "Student added successfully", data: creates })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// ...........................Fetch student data................................................................

const getStudentData = async function (req, res) {
    try {
        const studentData = await studentModel.find();
        return res.status(200).send({ status: true, message: "All Student Data", data: studentData });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// ...........................Fetch student data only by teacher...........................................................

const getStudentDataByTeacher = async function (req, res) {
    try {
        let Id = req.Id
        let query = req.query

        const { name, subject } = query

        const data = {}
        if (name) {
            data.name = name
        }
        if (subject) {
            data.subject = subject
        }
        data.teacherId = Id

        const studentData = await studentModel.find(data);
        return res.status(200).send({ status: true, message: "All Student Data", data: studentData });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// ............................update student data..............................................................

const updateStudentData = async function (req, res) {

    let studentData = req.studentData
    let data = req.body
    data.marks = parseInt(data.marks)
    const { name, subject, marks } = data
    const obj = {}
    if (name) {
        if (!dataValidation.isValidName(name)) return res.status(400).send({ status: false, message: "name should be string" });
        const checkDuplicate = await studentModel.findOne({ name: name, subject: studentData.subject, teacherId: studentData.teacherId });
        if (checkDuplicate) {
            return res.status(200).send({ status: false, message: "Your same student of same subject already exist" });
        }
        obj.name = name
    }
    if (subject) {
        if (!dataValidation.isValidName(subject)) return res.status(400).send({ status: false, message: "subject name should be string" });
        const checkDuplicate = await studentModel.findOne({ name: studentData.name, subject: subject, teacherId: studentData.teacherId });
        if (checkDuplicate) {
            return res.status(200).send({ status: false, message: "Your same student of same subject already exist" });
        }
        obj.subject = subject
    }
    if (marks) {
        if (!dataValidation.isValidsMarks(marks)) return res.status(400).send({ status: false, message: "marks should be number only" });
        obj.marks = marks
    }

    const updateData = await studentModel.findByIdAndUpdate({ _id: studentData._id.toString() }, obj, { new: true })
    return res.status(200).send({ status: true, message: "Student data updateded successfully", data: updateData });
}

// ............................delete student data..............................................................

const deleteStudentData = async function (req, res) {
    let Id = req.studentData._id.toString()

    const deleteData = await studentModel.findByIdAndUpdate({ _id: Id }, { $set: { isDeleted: true } }, { new: true })
    return res.status(200).send({ status: true, message: "Student data deleted successfully" });
}

module.exports = { createStudent, getStudentData, getStudentDataByTeacher, updateStudentData, deleteStudentData };