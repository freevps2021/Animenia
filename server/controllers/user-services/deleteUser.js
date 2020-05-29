const User = require('../../models/user');
const Post = require('../../models/post');
const Like = require('../../models/like');
const Dislike = require('../../models/dislike');
const Comment = require('../../models/comment');
const CommentReply = require('../../models/commentReply');
const CommentLike = require('../../models/commentLike');
const CommentDislike = require('../../models/commentDislike');
const Image = require('../../models/image');



module.exports = async (req, res) => {

    const user = await User.findById(req.params.id);

    try{
        const delPosts = Post.deleteMany({user: user._id});
        const delComments = Comment.deleteMany({user: user._id});
        const delCommentReplies = CommentReply.deleteMany({user: user._id});
        const delLikes = Like.deleteMany({liker: user._id});
        const delDislikes = Dislike.deleteMany({disliker: user._id});
        const delCommentDislikes = CommentDislike.deleteMany({user: user._id});
        const delCommentLikes = CommentLike.deleteMany({user: user._id});
        const delImages = Image.deleteMany({user: user._id});
    
    
        const [posts, comments, replies, likes, dislikes, commentDislikes, commentLikes, images]=
         await Promise.all([delPosts, delComments, delCommentReplies, delLikes,
                            delDislikes, delCommentDislikes, delCommentLikes, delImages]);

         if(posts && comments && replies && likes && dislikes && commentDislikes && commentLikes && images){

             const userNakama = await User.find({_id: user.nakamas});
                    userNakama.forEach(nakama => {
                        nakama.nakamas.splice(nakama.nakamas.indexOf(user._id.toString()), 1);
                        nakama.save();
                    })
             delUser = await User.deleteOne({_id: user._id});
            return res.status(202).json({succes: true, errors: 'User deleted'});
         }else{
            return res.status(404).json({succes: false, errors: 'Promises failed to resolve'});

         }                    
    }catch(e){
        if(e){
            return res.status(404).json({succes: false, errors: e});
        }
    }
   



}