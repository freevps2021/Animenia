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
        // check authentication 
      let auth = await jwt.verify(req.token, process.env.JWT_SECRET);
      if(auth){
          // get the post doc...
           const post = await Post.findById(req.params.id)
           if(post){
            let postOwner = post.user.toString();
            // check if the auth is the owner, otherwise refuse operation...
            if(postOwner === auth.id){
                 // delete images if found related to the post..
                 // check if the post isn't shared
                 if(post.hasMedia && post.isOriginal){
                     // get filename and docID from media_url
                       let url = post.media.split('/');
                       fileName = url[url.length - 1];
                       const id = fileName.substring(0, fileName.lastIndexOf('.'));
                         Image.findById(id)
                         .then(imgDoc =>{
                        // delete file if exists...
                       fs.unlink(`${imgDoc.path}/${fileName}`, (err, file)=>{
                        if(err){
                         return res.json({status:404, message:'Couldn\'t delete image!'});
                        }
                        if(file){
                         //if file deleted successfully, delete doc..
                         Image.deleteOne({_id: imgDoc._id})
                         .exec((err, doc)=>{
                             if(err){
                                return res.json({status:404, success:false, err:err});
                             }
                         })
                        }
                   })
                         })
                         .catch(err=>{
                             if(err) res.status(404).json({success:false, err:err});
                            })
               }
                   // delete related docs such as comments, likes, dislikes and comment replies from db...
                  
                        
         const delComments = await Comment.deleteMany({post_id: post._id});
         const delCommentReplies = await CommentReply.deleteMany({post: post._id});
         const delLikes = await Like.deleteMany({_id: post.likes});
         const delDislikes = await Dislike.deleteMany({_id: post.dislikes});
              if(delComments && delCommentReplies && delLikes && delDislikes){
                 if(post.isOriginal && post.shares > 0){
                    Post.deleteMany({'summary.originalPost':post._id})
                        .exec((err, posts)=>{
                            if(err){
                             return res.status(404).json({success:false, err:err});
                                 }
                                       
                            })
              
                    }
                    post.remove().then(async (removed) => {
                      if(removed){
                         const owner = await User.findById(auth.id);
                            if(owner){
                             if(owner.posts.indexOf(post._id.toString()) > -1){
                                 owner.posts.splice(owner.posts.indexOf(post._id.toString()), 1);
                                 const updatedUser = await owner.save();
                                     if(updatedUser){
                                        return res.json({success:true, status:202, message:'Post deleted successfully'});
                                    }else{
                                      return res.status(404).json({success: false, message: 'Couldn\'t save user document!'})
                                     }  
                            }else{
                             return res.status(404).json({success: false, message: 'Post not registerd in the auth posts!'})
                                }
                                          
                            }else{
                              return res.status(404).json({success: false, message: 'Owner not found!'})
                                }
                        }
                    }).catch(err=>{
                        if(err){
                        return res.status(404).json({success:false, err:err});
                        }
                     }) 
            }else{
                return res.status(404).json({success: false, message:'Something went wrong deleting docs'})
             }

                 // check if its an original post and has been shared before to delete the shared posts as well..
                       
                      

           
                  
     }else{
        return res.status(404).json({success:false, message:'Only Owner of the post can remove it.'});

     } 
          }
           
}    
    }catch(err){
       if(err){
           return res.status(404).json({errors: err, success: false});
       } 
    }
}