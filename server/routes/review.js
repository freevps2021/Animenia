const express = require('express');
const router = express.Router();
const Image = require('../models/image');



const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer');
const  fs = require('fs');
const checkAuth = require('../middelwares/checkAuth');


// Review Controllers...
const createReview = require('../controllers/Review-services/createReview');
const removeReview = require('../controllers/Review-services/deleteReview');
const getReview = require('../controllers/Review-services/getReview');
const getReviews = require('../controllers/Review-services/getReviews');
const updateReviewContent = require('../controllers/Review-services/updateReview');
const downvoteReview = require('../controllers/Review-services/downvoteReview');
const upvoteReview = require('../controllers/Review-services/upvoteReview');



// GET ROUTES

// GET A single Review ....
router.get('/:id', checkAuth, getReview);

// GET reviews...
router.get('/', checkAuth, getReviews);



// POST ROUTES...
router.post('/add-new-review', checkAuth, createReview);

// DELETE ROUTES...
router.delete('/:id', checkAuth, removeReview);


// PUT ROUTES
router.put('/:id', checkAuth, updateReviewContent);
router.put('/:id/upvote', checkAuth, upvoteReview);
router.put('/:id/downvote', checkAuth,downvoteReview);













module.exports = router;