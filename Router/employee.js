const express = require('express');
const { RegisterNewEmployee, LoginEmployee, getSingleEmployee, getAllEmployee, UpdateEmployeeDetaile, deleteEmployee } = require('../controler.js/employee');

const employeeRouter = express.Router()

employeeRouter.post('/add-new-employee',RegisterNewEmployee)
employeeRouter.post('/login-employee',LoginEmployee)
employeeRouter.get('/get-single-employee',getSingleEmployee)
employeeRouter.get('/get-all-employee',getAllEmployee)
employeeRouter.put('/update-employee',UpdateEmployeeDetaile)
employeeRouter.delete('/delete-employee/:employeeId',deleteEmployee)

module.exports = employeeRouter