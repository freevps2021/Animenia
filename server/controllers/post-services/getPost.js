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



module.exports =  async (req, res)=>{
    if(req.user){
        const post = await Post.findById(req.params.id)
                                .populate([{
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
                            ]);
        return res.status(200).json({success: true, message:'Post retrieved successfully.', post:post});
    }else{
        return res.status(401).json({success: false, message:'Not authorized.'});

    }
    
}