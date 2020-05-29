const Post = require('../../models/post');
const Image = require('../../models/image');
const User = require('../../models/user');
const Like = require('../../models/like');
const Dislike = require('../../models/dislike');
const Comment = require('../../models/comment');
const CommentReply = require('../../models/commentReply');
const CommentLike = require('../../models/commentLike');
const CommentDislike = require('../../models/commentDislike');

const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer');
const  fs = require('fs');


module.exports = (req, res)=>{
    if(req.user){
   // find reply
   CommentReply.findById(req.params.id)
   .then(reply=>{
       const replier = reply.user.toString();
       // check if the liker is the replier himself
       if(replier === req.user){
           console.log('Cannot dislike your own reply!');
           return res.json({status:404, success:false, message:'Cannot dislike your own reply!'})
       }else{
           // check if reply has been disliked before...
           for(let x =0; x < reply.dislikes.length; x++){
               if(reply.dislikes[x].disliker.toString() === req.user){
                   console.log('already disliked!')
                   res.json({status:404, success:false, message:'Reply already disliked!'});
                   return;
               }
           }
           // check if reply has been liked before from the auth, if true splice it..
           for(let i =0; i < reply.likes.length; i++){
               if(reply.likes[i].liker.toString() === req.user){
                   reply.likes.splice(i, 1);
                   break;
               }
           }
          
           reply.dislikes.push({disliker: req.user});
           reply.save()
           .then(reply =>{
               return res.json({status:200, success:true, message:'Reply disliked!'})
           })
           .catch(err=>{
               if(err){
               return res.json({status:404, success:false, err:err, message:'Couldn\'t save dislike to reply!'});
               }   
           })
       }
   })
   .catch(err=>{
       if(err){
           console.log(err);
           return res.json({status:404, success:false, err:err, message:'Reply not found!'});
       }   
   })  
    }else{
        return res.status(403).json({success:false, message:'Unauthorized!'});
  
    }
   
    
    }