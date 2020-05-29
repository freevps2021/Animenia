const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs= require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const Friendship = require('../../models/friendship');
const User = require('../../models/user');


module.exports = async(req, res)=>{
    if(req.user !=='undefined'){
      try{
          // get auth spaceship...
       let auth = await User.findById(req.user)
                            .populate([
                                {
                                    path: 'nakamas',
                                    model:'User'
                                },
                                {
                                    path: 'blacklist',
                                    model:'User'
                                }
                            ]);
        
       if(auth){
        // check if the contains the friend request_id... 
        if(auth.friendRequests.indexOf(req.params.request) > -1){
            // get request doc...
            let request = await Friendship.findById(req.params.request);
            let reqID = request._id.toString();
            // get  the sender...
            const sender = await User.findById(request.from)
                .populate([
                {
                    path: 'nakamas',
                    model:'User'
                },
                {
                    path: 'blacklist',
                    model:'User'
                }
            ]); 
                                    
            if(sender){
              if(sender.friendRequests.indexOf(reqID) > -1){
               // delete the requests from the spaceship reqs of both users...   
               auth.friendRequests.splice(auth.friendRequests.indexOf(reqID), 1);
               sender.friendRequests.splice(sender.friendRequests.indexOf(reqID), 1);
               // add users to each others spaceship friend-lists...
               auth.nakamas.push(request.from);
               sender.nakamas.push(request.to);
               // save changes to docs..
               const changedAuthSpaceship = await auth.save();
               const changedSenderSpaceship = await sender.save();
               if(changedAuthSpaceship && changedSenderSpaceship){
               // change status from 'pending' to 'accepted' and save...
                request.status = 'accepted';
                request.save(err=>{
                 if(err){
                 return res.json({status:404, success:false, err:err, message:'Cannot save request'});   
                }
                 return res.json({status:202, success: true, message: 'Friend added successfully!'}) ; 
                });   
               }else{
                return res.json({status:404, success: false, message: 'Acceptance failed'})  
               }

              }else{
                console.log('Request is not present in the sender requests!')
                return res.json({status:404, success: false, message: 'Request is not present in the sender requests!'})  

              }  
            }
               
        }else{
          console.log('There is no such request in your friend requests!');
          return res.json({status:404, success: false, message: 'There is no such request in your friend requests!'})  
        }  
       } 
      }catch(err){
          console.log(err);
        return res.json({status:404, success:false, err:err});
      }  
    }
}