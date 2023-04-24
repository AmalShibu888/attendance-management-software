const { json } = require('express');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    cName : {
        type : String,
        required : true
    },
    cid : {
        type : String,
        required : true
    },
    f1 : {
        type : Object,
        required : true
    },
    f2 : {
        type : Object,
        required : true
    },
    f3 : {
        type : Object,
        required : true
    },
    students : {
        type : Array
    }
},
{timestamps : true})

const CourseData = mongoose.model('CourseData' , courseSchema);

module.exports = CourseData;