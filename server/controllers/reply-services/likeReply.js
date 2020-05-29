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
            return res.json({status:404, success:false, message:'Cannot like your own reply!'})
        }else{
            // check if reply has been liked before...
            for(let x =0; x < reply.likes.length; x++){
                if(reply.likes[x].liker.toString() === req.user){
                    res.json({status:404, success:false, message:'Reply already liked!'});
                    return;
                }
            }
            // check if reply has been disliked before from the auth, if true splice it..
            for(let i =0; i < reply.dislikes.length; i++){
                if(reply.dislikes[i].disliker.toString() === req.user){
                    reply.dislikes.splice(i, 1);
                    break;
                }
            }
          
            reply.likes.push({liker: req.user});
            reply.save()
            .then(like =>{
                return res.json({status:200, success:true, message:'Reply liked!'})
            })
            .catch(err=>{
                if(err){
                return res.json({status:404, success:false, err:err, message:'Couldn\'t save like to reply!'});
                }   
            })
        }
    })
    .catch(err=>{
        if(err){
            return res.json({status:404, success:false, err:err, message:'Reply not found!'});
        }   
    })  
   }else{
    return res.status(401).json({success:false, message:'Cannot like your own reply!'})
   }
  
    
}    