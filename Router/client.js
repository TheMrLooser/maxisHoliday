const express = require('express');
const { RegisterNewClient, LoginClient, getSingleClient, getAllClients, UpdateClientDetaile, deleteClient, getAllDueAmountClients, getAllDueAmcClients } = require('../controler.js/client');
const { LoginWithCookie, LogOut } = require('../controler.js/loginWithCookie');

const clientRouter = express.Router()

clientRouter.post('/add-new-client',RegisterNewClient)
clientRouter.post('/login-client',LoginClient)
clientRouter.get('/get-single-client',getSingleClient)
clientRouter.get('/get-all-client',getAllClients)
clientRouter.get('/get-all-due-amount-client',getAllDueAmountClients)
clientRouter.get('/get-all-due-amc-client',getAllDueAmcClients)
clientRouter.put('/update-client',UpdateClientDetaile)
clientRouter.delete('/delete-client/:clientId',deleteClient)

clientRouter.get('/login-by-cookies', LoginWithCookie)
clientRouter.get('/logout', LogOut)

module.exports = clientRouter  