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
      // get both users...
       const auth = await Users.findById(req.user)
                                  .populate({
                                      path:'nakamas',
                                      model:'User'
                                  });
       const wastedNakama = await Users.findById(req.params.id)
                                  .populate({
                                      path:'nakamas',
                                      model:'User'
                                  });
  
      // check if both users are retrieved...
      if(auth & wastedNakama){
        const authID = auth._id.toString();
        const wastedID = wastedNakama._id.toString();
        const authIndex = wastedNakama.nakamas.indexOf(authID);
        const wastedIndex = auth.nakamas.indexOf(wastedID);
  
      // check if users are found in each others friendlist...
        if(authIndex > -1 && wastedIndex > -1){
  
      // delete both ids from both spaceships...  
          auth.nakamas.splice(wastedIndex, 1);
          wastedNakama.nakamas.splice(authIndex, 1);
          auth.save(err=>{
            if(err){
              return res.status(404).json({success:false, err: err});      
            }
          wastedNakama.save(err =>{
            if(err){
              return res.status(404).json({success:false, err: err});        
              }
  
            return res.status(404).json({success:true, message: 'User deleted from your spaceship\'s friend-list!'});        
          })   
          })
  
        }else{
  
          return res.status(404).json({success:false, message:'You are not friends with that User!'});   
        }
  
      }else{
          return res.status(404).json({success:false, message:'Error finding both users'});
          }
  
      }catch(err){
  
       if(err){
       return res.status(404).json({success:false, err:err});
       }
      }
    }else{
      return res.status(404).json({success:false, message:'Authorization Failed!'});   
    }  
  }