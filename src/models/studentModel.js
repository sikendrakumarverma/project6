const mongoose=require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const studentSchema= new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    marks : {
        type : Number,
        required: true,
        trim: true
    },
    teacherId: {        
        type     : ObjectId,
        required : [true, "teacherId must be provided"],
        ref      : "Teacher",
        trim     : true },
    isDeleted:{
        type:Boolean,
        default: false
    }
   
},{ timestamps: true })


module.exports = mongoose.model("Student", studentSchema)