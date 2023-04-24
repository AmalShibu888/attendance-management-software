const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseStudentSchema = new Schema({
    cid :{
        type : String,
        required : true
    },
    sid :{
        type : String,
        required : true
    }
},
{timestamps : true})

const CourseStudent = mongoose.model('CourseStudent' , CourseStudentSchema);

module.exports = CourseStudent;