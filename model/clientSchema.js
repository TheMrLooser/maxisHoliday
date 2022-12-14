const mongoose = require('mongoose')
const validator = require("validator")
const clientSchema = new mongoose.Schema({
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
    address:{
        type:String,

    },
    netAmount:{
        type:Number,
        default:0
    },
    paidAmount:{
        type:Number,
        default:0
    },
    balanceAmount:{
        type:Number,
        default:0
    },
    state:{
        type:String,
        default:'Other'
    },
    city:{
        type:String,
        default:'Other'
    },
    membershipNumber:{
        type:String
    },
    invoiceNumber:{
        type:String
    },
    salesEmployeeId:{
        type:String
    },
    clientId:{
        type:String
    },
    password:{
        type:String
    },
    gender:{
        type:String
    },
    DOB:{
        type:String
    },
    dateOfJoining:{
        type:String
    },
    fathersName:{
        type:String,
        default:null
    },
    mothersName:{
        type:String,
        default:null
    },
    membershipYear:{
        type:Number
    },
    membershipType:{
        type:String
    },
    totalAllowedDays:{
        type:Number,
        default:0
    },
    usedDays:{
        type:Number,
        default:0
    },
    balanceDays:{
        type:Number,
        default:0
    },
    totalAllowedNights:{
        type:Number,
        default:0
    },
    usedNight:{
        type:Number,
        default:0
    },
    balanceNight:{
        type:Number,
        default:0
    },
    spouseName:{
        type:String,
        default:null
    },
    spouseDOB:{
        type:String,
        default:null
    },
    marriageAnniversaryDate:{
        type:String,
        default:null
    },
    firstChildName:{
        type:String,
        default:null

    },
    firstChildDOB:{
        type:String,
        default:null

    },
    secondChildName:{
        type:String,
        default:null

    },
    secondChildDOB:{
        type:String,
        default:null
    },
    thirdChildName:{
        type:String,
        default:null

    },
    thirdChildDOB:{
        type:String,
        default:null
    },

    usingHolidayPackage:{
        type:Array,
        default:[]
    },
    role:{
        type:String,
        default:"Client"
    },
    token:{
        type:String
    },
    remark:{ 
        type:String
    },
    AMC:{
        type:Number ,
        default:0
    },
    AMCStatus:{
        type:String,
        default:"Paid"
    },
    AMCList:{
        type:Array,
        default:[] 
    },
    DueAMC:{
        type:Number,
        default:0
    },
    LastAMCPaidYear:{
        type:String,
        
    },
    adharcardNumber:{
        type:Number

    },

},{timestamps:true});

module.exports = mongoose.model('client',clientSchema);