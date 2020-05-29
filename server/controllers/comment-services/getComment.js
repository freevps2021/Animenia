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
    if(req.user){
        try{
            const comment = await Comment.findById(req.params.id)
                    .populate([
                     {
                         path: 'user',
                         model: 'User',
                         select: '_id avatar_url username'

                     },
                     {
                         path: 'likes',
                         model:'CommentLike'
                     },
                     {
                         path:'dislikes',
                         model: 'CommentDislike'
                     },
                     {
                         path: 'replies',
                         model: 'CommentReply',
                         populate:{
                             path:'user',
                             model: 'User',
                             select:'_id username avatar_url'
                         }
                     }
                 ]);
                 if(comment){
                     return res.status(202).json({success: true, comment});
                 }  
        }catch(e){
            if(e){
                return res.status(404).json({success: false, error: e});
            }
        }
    }
}