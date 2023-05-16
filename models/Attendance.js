const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
    cid :{
        type : String,
        required : true
    },
    sid :{
        type : String,
        required : true
    },
    day : {
        type : Number,
        required :true
    },
    month : {
        type : Number,
        required :true
    },
    year : {
        type : Number,
        required :true
    },
    hour : {
        type : Number,
        required :true
    },
    minute : {
        type : Number,
        required :true
    },
    slot :{
        type : Number,
        required :true
    },
    attendance :{
        type : Boolean,
        required : true
    }

},
{timestamps : true})

const Attendnace = mongoose.model('Attendance' , AttendanceSchema);

module.exports = Attendnace;