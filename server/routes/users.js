
// dependencies
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs= require('fs');
const path = require('path');

// models
const User = require('../models/user');
const Image = require('../models/image');

// middlewares..
const checkAuth = require('../middelwares/checkAuth');


// controllers

const getProfile = require('../controllers/user-services/getProfile');
const initProfile = require('../controllers/user-services/initProfile');
const searchUsers = require('../controllers/user-services/searchUsers');
const getAuth = require('../controllers/user-services/getAuth');
const getUser = require('../controllers/user-services/getUser');

const deleteUser = require('../controllers/user-services/deleteUser');

const {changeAddress, changeDisplayName, changeDateOfBirth, changeEmail, changePhoneNumber}= require('../controllers/user-services/updatePersonalInfos');

// packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors= require('cors');
const { check, validationResult } = require('express-validator');
const upload = require('../helper-functions/setMulterDiskStorage');
const uploadAvatar = require('../controllers/user-services/uploadAvatar');








router.get('/all', (req, res) =>{
    User.find({}, (err, users)=>{
       return res.status(200).json({message: 'All users have been called successfully', users})
    })
})



// init profile after registeration
router.post('/:id/initializeProfile', checkAuth ,[
    check('personalInfos.firstName').isLength({min: 3}).isAlpha(),
    check("personalInfos.lastName").isLength({min: 3}).isAlpha(),
    check('personalInfos.telephone').isMobilePhone()
    //add address and date validators...
], upload.single('profile'), initProfile);


// Change Address
router.post('/:id/change-address', checkAuth, changeAddress);

// change display-name...
router.post('/:id/change-displayname', checkAuth, [check('displayname').isLength({min:3}).isAlpha()], changeDisplayName);

// change email
router.post('/:id/change-email', checkAuth, [check('email').isEmail()] , changeEmail);

// change phone number...
router.post('/:id/change-phone', checkAuth, [check('telephone').isMobilePhone()], changePhoneNumber);

// change date of birth
router.post('/:id/change-dob', checkAuth, changeDateOfBirth);





// Get Auth User
router.get('/auth-user', checkAuth, getAuth);

// search users
router.get('/search-users', searchUsers);

// GET single user
router.get('/:id', checkAuth, getUser);

// set or upload avatar...
router.post('/:id/upload-avatar', upload.single('profile'), uploadAvatar);


// GET Profile
router.post('/:id/profile', checkAuth, getProfile);





// Delete User
router.delete('/:id', deleteUser);


module.exports = router;