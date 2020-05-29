const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs= require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const Friendship = require('../../models/friendship');
const User = require('../../models/user');



module.exports = async (req, res)=>{
    if(req.user){
        try{
            const auth = await User.findById(req.user)
            .populate({ path: nakamas, model : 'User', select:'-password'});
            if(auth.nakams.length < 1 ){
                return res.status(404).json({success: false, message: 'No Nakamas are Found. Please try to make some join your ship ;)' });
            }else{
                return res.status(202).json({success: true, nakamas: auth.nakamas });
            }
        }catch(e){
            if(e){
                return res.status(404).json({success: false, error: e });

            }
        }
    }
}