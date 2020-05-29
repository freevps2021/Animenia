
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
    // check for authentication..
    jwt.verify(req.token, process.env.JWT_SECRET, (err, auth)=>{
        if(err){
            console.log(err);
            console.log('unauthorized');
            res.json({status:401, message:'Unauthorized', success:false});
            return;
        }
    // find the to be edited post...
     Post.findById(req.params.id)
     .then(post =>{
         // check if the auth is the post owner..
         if(post.user.toString() === auth.id){
             // replace content..
           if(req.body.editedContent && req.body.editedContent.trim() !== ''){
            post.content = req.body.editedContent;
            post.save(err=>{
                if(err){
                    console.log(err);
                    res.json({status:404, message:'Could not save editing!', success:false});
                    return;
                }
                res.json({status:200, message:'Post edited!', editedContent: post.content, success:true});
            });
           }else{
            res.json({status:404, message:'Post edited!', message:'edit is not provided', success:false});
            console.log('edit is not provided');
            return;
           }
         }else{
             // if the auth is not the owner, send rejections..
           return res.json({status:401, message:'Only Owner can edit post content', success:false});
         }
     })
     // if err happend while finding the post...
     .catch(err =>{
         if(err){
             console.log(err);
             res.json({status:404, message:'Post not found!', success:false});
             return;
         }
     })   
    })
}