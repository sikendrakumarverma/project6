const express = require("express")
const router = express.Router()
const teacherController = require("../controllers/teacherController")
const studentController = require("../controllers/studentController")
const Auth = require("../midlleware/auth")


router.get("/test-me", function(req,res){
    res.send("Hi i am running")
})

//  ................................Teacher's API'S ..................................................................
router.post("/registerTeacher",teacherController.createTeacher)

router.post("/teacherLogin",teacherController.teacherLogin)

//  ................................Student's API'S ..................................................................
router.post("/addStudent",Auth.authentication ,studentController.createStudent)

router.get("/allStudentData" ,studentController.getStudentData)

router.get("/sepratedStudentData",Auth.authentication ,studentController.getStudentDataByTeacher)

router.put("/updateStudentData/:studentId",Auth.authentication,Auth.authorization ,studentController.updateStudentData)

router.put("/deleteStudentData/:studentId",Auth.authentication,Auth.authorization ,studentController.deleteStudentData)


// router.all("/**", function(req,res){
//     res.status(400).send("Invlaid endPoint")
// })

module.exports=router