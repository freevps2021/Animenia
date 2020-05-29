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
       // get friend request...
         const request = await Friendship.findOne({_id: req.params.id, status:'pending'});
         if(request){
           const reqID = request._id.toString();
           // get users
           const users = await User.find({_id: [request.to, request.from]});
   
         // check if both users has been found...
           if(users.length == 2){
             // check if both users has the request_id...  
             if(users[0].friendRequests.indexOf(reqID) > -1 && users[1].friendRequests.indexOf(reqID) > -1){
                // splice the request out of both spaceships... 
                users[0].friendRequests.splice(users[0].friendRequests.indexOf(reqID), 1);
                users[1].friendRequests.splice(users[1].friendRequests.indexOf(reqID), 1);
                const userOne = await users[0].save();
                const userTwo = await users[1].save();
               if(userOne && userTwo){
               // change status...
                 request.status = 'declined';
                 request.save(err=>{
                   if(err){
                     console.log(err);
                     return res.json({status:404, success:false, err:err});
                     }
                   return res.json({status:202, success:true, message:'Request Declined successfully!'})
                 })
               }else{
                   return res.json({status:404, success:false, message:'Could not save users..'});
               }
               
             }else{
               console.log('Error finding request in one of the users');
               return res.json({status:404, success:false, message:'Error finding request in one of the users'})
             } 
           }else{
               console.log('Error finding both users')
            return res.json({status:404, success:false, message:'Error finding both users'})
           }
         }
       }catch(err){
        if(err){
          console.log(err);
          return res.json({status:404, success:false, err:err});
        }   
       }
    }else{
        console.log('Authorization Failed');
       return res.json({status:401, success:false, message:'Authorization Failed!'})
    }
   }