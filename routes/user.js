const express = require('express');
const router = express.Router();
const userController = require('../data/userController')

router.get('/login',(req,res)=>{
    res.render('users/login')
})

router.get('/register',(req,res)=>{
    res.render('users/register')
})

router.post('/register', userController.registeruser);

router.post('/login', userController.login);




module.exports = router;