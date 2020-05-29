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
        // check if user is authenticated
     if(req.user){
         // find the authenticated user
        let authenticated = await User.findById(req.user);
        let postImgUrl;
        // if the req contains files set the url
        if(req.file){
            postImgUrl = req.protocol + "://" + 'localhost:3000/uploads/images/posts/' + req.file.filename;
        }
        let post = new Post({
            user: authenticated._id,
            isOriginal: true,
            content: req.body.content ? req.body.content : '',
            created_at: new Date(),
            hasMedia: req.file ? true : false,
            media: req.file ? postImgUrl : null   
        });
        post.save(err=>{
            if(err){
                console.log(err);
                return res.json({err:err})
            }
            // push the post id into the posts array of a user
            authenticated.posts.push(post._id);
            authenticated.save(err=>{
                if(err){
                    return res.json('saving post to into user\'s posts failed')
                }else{
                   return res.json({message:'Post is saved successfully.', post:post})
                } 
                })
        }) 
     }
    }catch(err){
        if(err){
          return res.json({status:404, message:'Post failed', errors:err});  
        }
    }
    }