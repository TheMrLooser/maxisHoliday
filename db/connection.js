const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config({path:"config/config.env"})

const DB = process.env.DATABASE;

const connectDB = ()=>{
    mongoose.connect(DB,{useNewUrlParser:true ,useUnifiedTopology:true }).then((data)=>{
        console.log(`mongodb conected with: ${data.connection.host}`)
    }).catch((e)=>{
        console.log(`connection failed :\n ${e} `)
    })
}
 
module.exports = connectDB