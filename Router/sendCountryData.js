const express = require('express');
const GetContry_Satate_city  = require('../controler.js/sendContrydata');

const countriesDataRouter = express.Router();

countriesDataRouter.get('/countries',GetContry_Satate_city)

module.exports = countriesDataRouter