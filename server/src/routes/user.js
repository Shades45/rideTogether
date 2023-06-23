const express=require('express')
const app=express.Router()
const UserController = require('../controller/user')
app.post('/register', UserController.registerNewUser)
app.post('/login', UserController.loginUser)
app.get('/users', UserController.getAllUser)
app.put('/change-password', UserController.changePassword)
app.get('/users/:id', UserController.getUserDetailsById)
// new put method for user id
app.put('/change-password/:id', UserController.changePasswordById)

module.exports=app;