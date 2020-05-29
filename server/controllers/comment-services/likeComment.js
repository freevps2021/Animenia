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
            const comment = await Comment.findById(req.params.id).populate({
                path: 'likes',
                select:'user'
            });

            const likers = comment.likes.map(like => like.user.toString());

            if(likers.indexOf(req.user) > -1 ){
                return res.status(403).json({success: false, message: 'You already liked that Comment'});
            }else{
               const commentLike = new CommentLike({
                   post: req.params.post,
                   user: req.user
               });
               const savedCommentLike = commentLike.save();
               if(savedCommentLike){
                   comment.likes.push(savedCommentLike._id);
                   const savedComment = await comment.save();
                   return res.status(202).json({success: true, message:'Comment Liked', like: commentLike});
               }
            }
        }catch(e){
            if(e){
                return res.status(404).json({success: false, error: e});
            }
        }
    }
}