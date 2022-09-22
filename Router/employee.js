const express = require('express');
const { RegisterNewEmployee, LoginEmployee, getSingleEmployee, getAllEmployee, UpdateEmployeeDetaile, deleteEmployee } = require('../controler.js/employee');
const SendMail = require('../Mail/SendMail');

const employeeRouter = express.Router()

employeeRouter.post('/add-new-employee',RegisterNewEmployee)
employeeRouter.post('/login-employee',LoginEmployee)
employeeRouter.get('/get-single-employee',getSingleEmployee)
employeeRouter.get('/get-all-employee',getAllEmployee)
employeeRouter.put('/update-employee',UpdateEmployeeDetaile)
employeeRouter.delete('/delete-employee/:employeeId',deleteEmployee)
employeeRouter.post('/send-mail',SendMail)

module.exports = employeeRouter