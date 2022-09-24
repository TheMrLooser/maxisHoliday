const express = require('express')
const connectDB = require('./db/connection')
const dotenv = require('dotenv');
const clientRouter = require('./Router/client');
const bodyParser = require('body-parser');
const employeeRouter = require('./Router/employee');
dotenv.config({path:'config/config.env'})
const cors = require('cors')
const cookieParser = require("cookie-parser");
const requestHoliday = require('./Router/requestHoliday');


const app = express()
app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin:['http://localhost:3000','https://maxisholiday.netlify.app'],
    methods: ['GET', 'PUT', 'POST','DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'], 
    credentials: true, 
    maxAge: 600, 
    exposedHeaders: ['*', 'Authorization' ] 
})) 
app.use("/client",clientRouter);
app.use("/employee",employeeRouter);
app.use("/holidays",requestHoliday);


connectDB()
app.listen(process.env.PORT,()=>{
    console.log("server is runnig at :",process.env.PORT)
})