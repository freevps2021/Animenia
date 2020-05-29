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
           const reply = await CommentReply.findById(req.params.id);
           if(reply.user.toString() === req.user){
             if(req.body.updatedContent && req.body.updatedContent.trim() !== ' '){
                reply.content = req.body.updatedContent;
                const updatedReply = reply.save();
                 return res.status(202).json({success: true, updatedReply});
             }else{
              return res.status(403).json({success: false, message: 'Error happend while updating. Please check if a new content is provided and not empty!'}); 
             }
           }else{
            return res.status(401).json({success: false, message: 'Only Reply owner could update that Reply!'}); 

           } 
        }catch(e){
            if(e){
               return res.status(404).json({success: false, error: e}); 
            }
        }
    }
}