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
          const auth = await User.findById(req.user);
          const toBeBlockedUser = await User.findById(req.params.id);
            // check if the user is already blocked by the auth..
          if(auth.blacklist.indexOf(req.params.id) > -1 ){
            return res.status(404).json({success: false, message: 'User is already blocked!' });
            // check if the auth is blocked by the user...
          }else if(toBeBlockedUser.blacklist.indexOf(req.user) > -1 ){
            return res.status(404).json({success: false, message: 'That user is already blocking you :( !' });
          }else{
              // check if the user is a nakama, if yes delete..
              if(auth.nakamas.map(nakama => nakama.toString()).indexOf(req.params.id) > -1){
                  auth.nakamas.splice(auth.nakamas.map(nakama => nakama.toString()).indexOf(req.params.id), 1);
               // check if the auth is a nakama if yes delete...   
              }else if(toBeBlockedUser.nakamas.map(nakama => nakama.toString()).indexOf(req.user) > -1){
                toBeBlockedUser.nakamas.splice(toBeBlockedUser.nakamas.map(nakama => nakama.toString()).indexOf(req.user), 1);
              }

              // Add the user to the blacklist...
              auth.blacklist.push(toBeBlockedUser._id);
              const updatedAuth = auth.save();
              const updatedUser = toBeBlockedUser.save();
              return res.status(202).json({success: true, message: 'User blocked successfully!'});
          }
        }catch(e){
            if(e){
                return res.status(404).json({success: false, error: e });
 
            }
        }
    }
}