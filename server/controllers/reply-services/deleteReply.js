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
    if(req.user){
        CommentReply.findById(req.params.replyId)
        .populate([{
            path: 'post',
            model: 'Posts',
            select:'user _id'
            },
            {
             path :'comment',
             model:'Comment',
             select:'_id user replies',
                
            }
        ])
        .exec((err, reply)=>{
          if(err){
           // if reply not found..
           return res.json({status:404, message:'Reply not found!', success:false, error:err});         
          }
         // check if the auth is the post owner, commentator or replier. If true allow delete..
         const postOwner = reply.post.user.toString();
         const commentator = reply.comment.user.toString();
         const replier = reply.user.toString();
         console.log(postOwner, commentator, replier, req.user);
          if(postOwner === req.user || commentator === req.user || replier === req.user){
             reply.remove()
             .then(reply=>{
                 const replyId= reply._id.toString();
                 Comment.findById(reply.comment._id, (err, comment)=>{
                  if(err){
                    // if comment not found..
                    return res.json({status:404, message:'Comment not found!', success:false, error:err});         
                     }
                     // delete reply ref from replies array in the comment doc..
                     comment.replies.splice(comment.replies.indexOf(replyId),1);
                     comment.save(err=>{
                         if(err){
                          return res.json({status:404, message:'Couldn\'t delete reply from comment!', success:false, error:err});              
                         }
                         return res.json({status:200, message:'Reply deleted!', success:true});              
    
                     })  
                 })
             })
             .catch(err =>{
              return res.json({status:404, message:'Couldn\'t delete reply!', success:false, error:err});              
             }); 
             // if the auth user is neither the post, comment nor reply owner..
          }else{
              console.log('Not allowed to delete reply!!')
            return res.json({status:401, message:'Not allowed to delete reply!!', success:false});            
          }
        }) 
    }else{
        return res.status(401).json({success:false, message:'Not allowed to delete reply!!'});            

    }
       

    
}