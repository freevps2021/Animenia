const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs= require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const Friendship = require('../../models/friendship');
const User = require('../../models/user');



module.exports = async (req, res) =>{
    if(req.user){
        try{
            const requests = await Friendship.find({to: req.user, status: 'pending'})
            .populate({
                path: 'from',
                model: 'User',
                select: '_id username avatar_url'
            });
            if(requests.length < 1){
                return res.status(404).json({success: false, message: 'No Pending Requests are Found :(' });
  
            }else{
                return res.status(202).json({success: true, requests});

            }

        }catch(e){
            if(e){
                return res.status(404).json({success: false, error: e });
            }
        }
    }
}