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



module.exports = async (req, res) =>{
  
    if(req.user){
        try{
            const comment = await Comment.findById(req.params.cid)
            .populate([
                {
                  path:'user',
                  model:'User',
                  select:'_id username avatar_url nakamas blacklist'  
                },
                {
                    path:'post_id',
                    model:'Posts',
                    populate:{
                        path:'user',
                        model:'User'
                    }
        
                }
            ]);

            const reply = new CommentReply({
                user: req.user,
                post: comment.post_id._id,
                comment: comment._id,
                content: req.body.reply,
                created_at: req.body.created_at
            });

            // if the replier is on the blacklist of the comentator, don't accept the reply..
            if(comment.user.blacklist.indexOf(req.user) > -1){
                return res.json({status:403, message:'Cannot reply on comments of that user!', success:false});    
            }else{
                const newReply = await reply.save();
                if(newReply){
                    comment.replies.push(reply._id);
                    comment.save(err=>{
                        // catch error saving the reply id into the comment document..
                        if(err){
                        return res.status(404).json({success:false, message:'Couldn\'t save comment change!', error:err});  
                        }
                        return res.status(200).json({success:true,  message:'Reply saved!'});
                    })
                }
            }
            
        }catch(e){
            if(e){
                return res.status(404).json({success:false, message:'Comment Not Found!', error: e});  
 
            }
        }
      

    }else{
        return res.status(401).json({success:false, message:'Unauthorized'});  
    }
  
}    