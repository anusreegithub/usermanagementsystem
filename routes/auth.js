const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', authController.register);

router.post('/login', authController.login,   (req, res) => {
    res.render('/users/home');
});

router.get('/users/home', authController.listusers);


router.get('/admin/home', authController.Alllistusers);




router.get('/update/:id', authController.getUserById);

router.post('/update/:id', authController.updateUser);

router.get('/delete/:id', authController.deleteUser);

    




module.exports = router;

