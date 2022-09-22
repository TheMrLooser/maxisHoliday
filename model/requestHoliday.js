const mongoose = require('mongoose')
const validator = require("validator")


const requestSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        validate:validator.isEmail,
    },
    phoneNumber:{
        type:String,
    },
    clientId:{
        type:String
    },
    checkIn:{
        type:String
    },
    checkOut:{
        type:String
    },
    city:{
        type:String
    },
    requestDate:{
        type:String
    },
    remark:{
        type:String
    },
    status:{
        type:String,
        default:'Pending'
    },
    noOfAdults:{
        type:Number,
        default:0
    },
    noOfChilds:{
        type:Number,
        default:0
    }
     
    

},{timestamps:true});

module.exports = mongoose.model('holidayRequest',requestSchema);