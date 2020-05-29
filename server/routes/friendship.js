const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs= require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const Friendship = require('../models/friendship');
const User = require('../models/user');
const checkAuth = require('../middelwares/checkAuth');


// Get Controllers
const sendNakamaReq = require('../controllers/friendship-services/sendNakamaReq');
const acceptNakamaReq = require('../controllers/friendship-services/acceptNakamaReq');
const declineNakamaReq = require('../controllers/friendship-services/declineNakamaReq');
const deleteNakama = require('../controllers/friendship-services/deleteNakama');
const getNakamaList = require('../controllers/friendship-services/getNakamaList');
const blockNakama = require('../controllers/friendship-services/blockNakama');
const getNakamaRequests = require('../controllers/friendship-services/getNakamaReqs');




 // Get nakama List where user id is specified in the query..
 router.get('/nakama-list', checkAuth, getNakamaList);

// Get Nakama Requests of the authenticated User...
router.get('/nakama-requests', checkAuth, getNakamaRequests);

// Send Nakama Request
router.post('/:id/nakama-request', checkAuth, sendNakamaReq);



//  Accept Nakama Request 
router.post('/:request/accept', checkAuth, acceptNakamaReq);



//  Decline Nakama Request...
router.post('/:id/decline', checkAuth, declineNakamaReq);


// Block Nakama
router.post('/:id/block-nakama', checkAuth, blockNakama);


// Delete Nakama
router.delete('/:id/delete', checkAuth, deleteNakama);



module.exports = router;