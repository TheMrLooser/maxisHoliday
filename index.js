const express = require('express')
const connectDB = require('./db/connection')
const dotenv = require('dotenv');
const clientRouter = require('./Router/client');
const bodyParser = require('body-parser');
const employeeRouter = require('./Router/employee');
dotenv.config({path:'config/config.env'})

const app = express()
app.use(express.json())
app.use("/client",clientRouter);
app.use("/employee",employeeRouter);

connectDB()
app.listen(process.env.PORT,()=>{
    console.log("server is runnig at :",process.env.PORT)
})