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
    jwt.verify(req.token, process.env.JWT_SECRET, (err, auth)=>{
        if(err){
            return res.status(403).json({err:'unauthorized'});
            
        }else{
            Post.findById(req.params.id, (err, post)=>{
                if(err) {
                return res.json({err: 'post not found'});
                
                }
                if(req.body.content.trim() !== ''){
                    let comment = new Comment();
                    comment.content = req.body.content,
                    comment.user = auth.id,
                    comment.created_at = req.body.created_at,
                    comment.post_id = post._id;
                comment.save(err=>{
                     if(err){
                         console.log(err);
                         return res.json({message:'couldn\'t save comment!', err:err, success:false, status:404});
                         
                        } 
                    post.comments.push(comment._id);
                    post.save(err =>{
                        if(err){
                            return res.json({err:'couldn\'t save post'});
                            
                        }
                        res.status(200).json({
                            message:'comment added!'
                         });
                    })
                });
                }else{
                   return res.status(404).json({message:'Comment is Empty!',  success:false});

                }
             
            })
        }
    })

}