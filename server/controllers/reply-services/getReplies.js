const Post = require('../../models/post');
const Image = require('../../models/image');
const User = require('../../models/user');
const Like = require('../../models/like');
const Dislike = require('../../models/dislike');
const Comment = require('../../models/comment');
const CommentReply = require('../../models/commentReply');
const CommentLike = require('../../models/commentLike');
const CommentDislike = require('../../models/commentDislike');



module.exports = async (req, res)=>{
    if(req.user){
        try{
           const replies = await CommentReply.find({comment: req.params.comment})
                .populate({
                    path: 'user',
                    model: 'User',
                    select: '_id username avatar_url'
                });
            return res.status(200).json({success: true, replies})     
        }catch(e){
            if(e){
                return res.status(404).json({success: false, error: e });
            }
        }
    }
}