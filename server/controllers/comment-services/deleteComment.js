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
    jwt.verify(req.token, process.env.JWT_SECRET, (err, auth)=>{
        if(err){
            res.json({err:err});
            return;
        }
        Comment.findById(req.body.id)
        .then(comment =>{
            // find the post related to that comment..
            Post.findById(req.params.id)
            .then(post =>{
                // check if the auth is neither post or comment owner..
                const postOwner = post.user.toString();
                const commentOwner = comment.user.toString();
                if(auth.id === postOwner || auth.id === commentOwner){
                    comment.remove()
                    .then(comment =>{
                        // check if the comment is found in the comments array of the post..
                        const cid = comment._id.toString();
                        const index = post.comments.indexOf(cid);
                        if(index > -1){
                          post.comments.splice(index,1);
                          post.save()
                          .then(async (post) => {
                              try{
                                const deletedRplies = await CommentReply.deleteMany({_id: comment.replies});
                                const deletedLikes = await CommentLike.deleteMany({comment_Id: comment._id});
                                const deletedDislikes = await CommentDislike.deleteMany({comment_Id: comment._id});
                                  if(deletedRplies && deletedLikes && deletedDislikes){
                                    return res.status(202).json({success:true,  message:'Comment removed!!'});
    
                                  }else{
                                      return res.status(404).json({success: false, message: 'Error deleting related actions!'})
                                  }
                              }catch(err){
                                  if(err){
                                    return res.status(404).json({success: false, message: 'Something went wrong!'})
        
                                  }
                              }
                             
                            
                          })
                          .catch(err=>{
                              if(err){
                                return res.status(404).json({success:false,err:err, message:'Couldn\'t save Post'});
                                
                              }
                          })
                        }else{
                         return res.status(404).json({success:false,  message:'Couldn\'t find comment'});
                        }
                    })
                    // catch errors while removing the comment...
                    .catch(err=>{
                        if(err){
                         res.json({status:404, success:false, err:err, message:'Couldn\'t remove comment'});
                         return;
                        }
                    })
                }else{
                   // emit error if the auth is neither post or comment owner..
                   res.json({status:403, success:false,  message:'Only comment and post owners can remove the comment'});
                }
                
            })
            // catch errors finding the post...
            .catch(err =>{
                if(err){
                 console.log(err);
                 return res.status(404).json({success:false, err:err, message:'Post Not Found'});
                 
                }
            })
            
        })
        // catch errors finding the comment...
        .catch(err =>{
            if(err){
                return res.status(404).json({success:false, err:err});
                return;
            }
        })
      
    })
    }