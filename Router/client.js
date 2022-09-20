const express = require('express');
const { RegisterNewClient, LoginClient, getSingleClient, getAllClients, UpdateClientDetaile, deleteClient } = require('../controler.js/client');
const { LoginWithCookie, LogOut } = require('../controler.js/loginWithCookie');

const clientRouter = express.Router()

clientRouter.post('/add-new-client',RegisterNewClient)
clientRouter.post('/login-client',LoginClient)
clientRouter.get('/get-single-client',getSingleClient)
clientRouter.get('/get-all-client',getAllClients)
clientRouter.put('/update-client',UpdateClientDetaile)
clientRouter.delete('/delete-client',deleteClient)

clientRouter.get('/login-by-cookie', LoginWithCookie)
clientRouter.get('/logout', LogOut)
module.exports = clientRouter