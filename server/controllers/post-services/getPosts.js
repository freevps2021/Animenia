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
    jwt.verify(req.token, process.env.JWT_SECRET,(err, authData)=>{
     if(err){
         res.status(403).json({err:err});
     }else{
        User.findOne({_id: authData.id}, (err, user)=>{
            if(err){
                res.json({err:'something went wrong'});
                return;
            }
            Post.find({user:[user._id, ...user.nakamas]})
            .populate([
                {
                    path: 'summary.originalPost',
                    model: 'Posts',
                    select:'_id content hasMedia media created_at'
                },
                
                {
                path:'comments',
                model:'Comment',
                populate:[{
                    path:'user',
                    model:'User',
                    select:'username _id avatar_url' 
                },
                {
                    path:'replies',
                    model:'CommentReply',
                    populate:{
                        path:'user',
                        model:'User',
                        select:'_id username avatar_url'
                    }    
                },
                {
                    path:'likes',
                    model:'CommentLike',
                },
                {
                    path:'dislikes',
                    model:'CommentDislike',
                }
            ]
            },
            {
                path:'user',
                model:'User',
                select:'username _id avatar_url'   
            },
            {
                path:'likes',
                model:'Like',
                populate:{
                    path:'liker',
                    model:'User',
                    select:'username _id avatar_url' 
                }   
            },
            {
                path:'dislikes',
                model:'Dislike',
                populate:{
                    path:'disliker',
                    model:'User',
                    select:'username _id avatar_url' 
                }  
            },
            {
                path:'summary.owner',
                model:'User',
                select:'username _id avatar_url'   
            }
        ])
            .then(posts=>{
            if(err){
             res.json({err:err, status:404, success:false, message:'Something went wrong finding all galaxy posts'});
             return;
            }
           
            res.json({status:202, success:true, galaxyPosts:posts}); 
        })


        })
 
     }

    })


}