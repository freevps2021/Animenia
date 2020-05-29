// dependencies
const express = require('express');
const router = express.Router();
// models
const User = require('../models/user');
const Image = require('../models/image');

// middlewares..
const checkAuth = require('../middelwares/checkAuth');

// controllers
const registerUser = require("../controllers/auth-services/register");
const authenticate = require("../controllers/auth-services/authenticate");
const verifyUser = require('../controllers/auth-services/verifyMail');
const forgotPassword = require("../controllers/auth-services/forgot-password");
const resetPassword = require("../controllers/auth-services/resetPassword");

// packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors= require('cors');
const { check, validationResult } = require('express-validator');


router.post('/register', [
    check('email').isEmail(),
    check('username').isLength({min: 3}),
    check('password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
] , registerUser);


router.post('/login', authenticate);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-account/:token', verifyUser);




module.exports = router;