const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LoginDataSchema = new Schema({
    fName : {
        type : String,
        required : true
    },
    lName : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    designation : {
        type : String,
        required : true
    },
    status :{
        type : Boolean,
        required : true
    }
},
{timestamps : true})

const LoginData = mongoose.model('LoginData' , LoginDataSchema);

module.exports = LoginData;