
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
                // check if the disliker is the owner of the post...
                if(post.user.toString() === req.user){
                    res.json({status:404, success:false, err:'you cannot like your own post'});
                    return;
                }

                // check if post has been disliked by the auth..
                if(post.dislikes.filter(dislike => dislike.disliker.toString() == req.user).length > 0){
                    return res.json({status:404, success: false, message: 'Post has been already disliked'});
                }else{
                    const dislike = new Dislike({
                        disliker: auth._id,
                        post:post._id
                         });
                    const newDislike = await dislike.save();
                    if(newDislike){
                        post.dislikes.push(newDislike._id);

                        // remove like if auth has liked the post before..
                        post.likes.forEach(like =>{
                            if(like.liker.toString() == newDislike.disliker.toString()){
                                post.likes.splice(like, 1);
                            }
                        }) 
                        
                        const updatedPost = await post.save();
                        if(updatedPost){
                            return res.json({status: 200, success: true, message:'Post Disliked!'})
                        }
                    }  
                }

            }else{
                console.log('Post')
             return res.status(404).json({success:false, err:'Post Not Found!'});
            }
           }else{
               console.log('auth not found')
           }
        }catch(err){
            if(err){
                console.log('468: ', err);
               return res.status(404).json({success:false, err:err});

            }
        }
    }else{
        console.log('Authorization')
       return res.status(401).json({success:false, err:'Authorization Failed!'});
 
    }
}