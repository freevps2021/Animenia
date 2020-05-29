const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs= require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const Friendship = require('../../models/friendship');
const User = require('../../models/user');



module.exports = async(req, res)=>{
    if(req.user){
      try{
         // find users..
          const auth = await User.findById(req.user)
                                .populate([{
                                    path:'nakamas',
                                    model:'User'
                                },{
                                    path:'blacklist',
                                    model:'User'
                                }
                            ]);
         const nakama = await User.findById(req.params.id)
                            .populate({
                                path:'blacklist',
                                model:'User'
                            });                

          if(auth && nakama){
           const authID = req.user.toString();
           const nakamaID = req.params.id;
             // check if there is already a pending freindship request...
             let authFriendship = await Friendship.findOne({from: authID, to: nakamaID, status:'pending'});
              if(authFriendship){
               res.json({status:404, success:false, message:'There is already a pending request with that User'});
               return;
              }
             // check if there is already a pending freindship request...
             let targetFriendship = await Friendship.findOne({from: nakamaID, to: authID, status:'pending'});
             if(targetFriendship){
              res.json({status:404, success:false, message:'You already have a pending request from that user.'});
              return;
             }
             // check if the auth in the blacklist of the target...
               if(nakama.blacklist.indexOf(authID) > -1){
                  res.json({status:404, success: false, message:'You cannot send friendship requests to that User'});
                  return; 
               } 
            // check if the auth in the blacklist of the target...
               if(auth.blacklist.indexOf(nakamaID) > -1){
                  res.json({status:404, success: false, message:'User is in your blacklist. You might want to remove it.'});
                  return; 
               }

               if(auth.nakamas.indexOf(nakamaID) > -1){
                res.json({status:404, success: false, message:'User already exists in your nakama list'});
                return; 
               }
               if(nakama.nakamas.indexOf(authID) > -1){
                res.json({status:404, success: false, message:'You already exist in that user\'s nakama list.'});
                return; 
               }
            // if checks has been passed successfully..
               const friendReq = new Friendship({
                   from: authID,
                   to: nakamaID,
                   status: 'pending'
               });
               let saveReq = await friendReq.save();
               if(saveReq){
                   auth.friendRequests.push(saveReq._id);
                   nakama.friendRequests.push(saveReq._id);
                const nakamaUpdated = await nakama.save();
                const authUpdated = await auth.save();
                if(nakamaUpdated && authUpdated){
                    return res.json({status: 222, success: true,  message:'Nakama Request has been sent...!'})
                }else{
                    return res.json({status: 404, success: false,  message:'Nakama Request Failed!'})
                }    
               }

          }else{
            return res.json({status: 404, success: false,  message:'Authenticated User not found!'})
  
          }

      }catch(err){
          if(err){
              console.log(err);
              return res.json({status: 401, success: false, err: err, message:'Invalid Token'})
          }
      }
    }else{
        return res.json({status: 401, success: false, message:'authorization failed!'})

    }
}