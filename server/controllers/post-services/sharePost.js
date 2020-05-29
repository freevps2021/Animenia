
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



module.exports = async (req, res)=>{
    try{
     let auth = await jwt.verify(req.token, process.env.JWT_SECRET);
     if(auth !=='undefined'){
         let authUser = await User.findById(auth.id);
         let sharedPost = await Post.findById(req.params.id).populate([{
             path:'summary.owner',
             model:'User',
             select:'_id username avatar_url'
         },
         {
            path:'summary.originalPost',
            model:'Posts',
            select:'_id content hasMedia created_at media'
        }
        ]);
         if(sharedPost !== 'undefined' || sharedPost !=='null'){
             // if the post is original, set the id as the params id. If not, set it as the original one
            let id = sharedPost.isOriginal? req.params.id : sharedPost.summary.originalPost._id ;
            let share =  new Post({
            user: auth.id,
            isOriginal: false,
            summary: sharedPost.isOriginal ? {
                owner: sharedPost.isOriginal ? sharedPost.user : sharedPost.summary.owner._id,
                originalPost: id,
            } : sharedPost.summary,
            content: req.body.content,
            created_at: new Date(),
            });

            let shared = await share.save();
            if(shared){
                // if the post being shared is already an original one, increment shares directly..
                if(sharedPost.isOriginal){
                    sharedPost.shares += 1;
                    sharedPost.save(err=>{
                     if(err){
                       return res.json({status:404, success:false, err:err, message:'could\'t update shares number!'})
                        }
                        authUser.posts.push(shared._id);
                        authUser.save(err=>{
                            if(err){
                             return res.json({status:404, success:false, err:err, message:'could\'t save post to user!'})
                            }
                        return res.json({status:202, success:true, message:'Post shared'});  

                        })
                    })
                }else{

                // if post being shared is already shared from another post, find the original and increment its shares number..
                    let originalPost = await Post.findById(sharedPost.summary.originalPost._id);
                    originalPost.shares+=1;
                    originalPost.save(err=>{
                        if(err){
                         return res.json({status:404, success:false, err:err, message:'could\'t update shares number!'})
                           }
                        authUser.posts.push(shared._id);
                        authUser.save(err=>{
                            if(err){
                             return res.json({status:404, success:false, err:err, message:'could\'t save post to user!'})
                            }
                        return res.json({status:202, success:true, message:'You shared this Post.'});  

                        })
                       })
                }
                
            }
         }
     }

    }catch(err){
        if(err){
           return res.json({status:404, success:false, err:err, message:'could\'t share this post!'});
        }
    }

}