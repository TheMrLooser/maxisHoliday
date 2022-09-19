const express = require('express')
const connectDB = require('./db/connection')
const dotenv = require('dotenv');
const clientRouter = require('./Router/client');
const bodyParser = require('body-parser');
const employeeRouter = require('./Router/employee');
dotenv.config({path:'config/config.env'})
const cors = require('cors')



const app = express()
app.use(express.json())
app.use("/client",clientRouter);
app.use("/employee",employeeRouter);
app.use(cors({
    origin:'http://localhost:3000',
    methods: ['GET', 'PUT', 'POST','DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'], 
    credentials: true, 
    maxAge: 600, 
    exposedHeaders: ['*', 'Authorization' ] 
}))

connectDB()
app.listen(process.env.PORT,()=>{
    console.log("server is runnig at :",process.env.PORT)
})