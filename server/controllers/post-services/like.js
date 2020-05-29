
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


module.exports = async (req, res)=>{
    if(req.user){
        try{
        const auth = await User.findById(req.user);
           if(auth){
            const post = await Post.findById(req.params.id)
            .populate([{
                path:'likes',
                model:'Like',
                select:'liker'
            },
            {
               path:'dislikes',
               model:'Dislike',
               select:'disliker'
           }
           ]);
            if(post){
                // check if the liker is the owner of the post...
                if(post.user.toString() === req.user){
                    res.json({status:404, success:false, err:'you cannot dislike your own post'});
                    return;
                }

                // check if post has been liked by the auth..
                if(post.likes.filter(like => like.liker.toString() == req.user).length > 0){
                    return res.json({status:404, success: false, message: 'Post has been already disliked'});
                }else{
                    const like = new Like({
                        liker: auth._id,
                        post:post._id
                         });
                    const newLike = await like.save();
                    if(newLike){
                        post.likes.push(newLike._id);
                        // remove dislike if auth has disliked the post before..
                        post.dislikes.forEach(dislike =>{
                            if(dislike.disliker.toString() == newLike.liker.toString()){
                                post.dislikes.splice(dislike, 1);
                            }
                        }) 
                        
                        const updatedPost = await post.save();
                        if(updatedPost){
                            return res.json({status: 200, success: true, message:'Post Liked!'})
                        }
                    }  
                }

            }else{
                console.log('Post')
             return res.status(404).json({success:false, err:'Post Not Found!'});
            }
           }
        }catch(err){
            if(err){
                console.log(err);
               return res.status(404).json({success:false, err:err});

            }
        }
    }else{
        console.log('Authorization')
       return res.status(401).json({success:false, err:'Authorization Failed!'});
 
    }
}