const express = require('express');
const { CreateRequest, UpdateRequest, GetAllRequest, DeleteRequest } = require('../controler.js/requestHoliday');

const requestHoliday = express.Router();

requestHoliday.post('/create-request',CreateRequest)
requestHoliday.put('/update-request',UpdateRequest)
requestHoliday.get('/get-all-request/:status',GetAllRequest)
requestHoliday.delete('/delete-request',DeleteRequest);

module.exports = requestHoliday