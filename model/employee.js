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
    },
    phone:{
        type:Number,
        required:true,
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
    state:{
        type:String
     },
    city:{
        type:String
    },
    role:{
        type:String,
        default:'Employee'
    },
    token:{
        type:String
    }


},{timestamps:true});

module.exports = mongoose.model('employee',employeeSchema);