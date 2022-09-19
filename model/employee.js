const mongoose = require('mongoose')
const validator = require("validator")
const employeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        validate:validator.isEmail,
        unique:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    employeeId:{
        type:String
    },
    DOB:{
        type:String
    },
    password:{
        type:String
    },
    address:{
        type:String
    },
    gender:{
        type:String
    },
    adharcardNumber:{
        type:Number,

    },
    clients:{
        type:Array,
        default:[]
    },
    role:{
        type:String,
        default:'Employee'
    }
    

},{timestamps:true});

module.exports = mongoose.model('employee',employeeSchema);