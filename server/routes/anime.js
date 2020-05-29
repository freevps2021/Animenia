const express = require('express');
const router = express.Router();
const Image = require('../models/image');



const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer');
const  fs = require('fs');
const checkAuth = require('../middelwares/checkAuth');


// Get Anime Controllers...
const createAnime = require('../controllers/Anime-services/createAnime');
const getAnime = require('../controllers/Anime-services/getAnime');


// GET ROUTE
router.get('/', checkAuth, getAnime);

// POST ROUTES...
router.post('/add-new-anime', checkAuth, createAnime);

















module.exports = router;