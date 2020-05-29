// models
const User = require('../../models/user');
const Post = require('../../models/post');
const Image = require('../../models/image');
// packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');




module.exports = async (req, res) => {
    if(req.user){
        try{
            let user =  await User.findById(req.params.id).select("-password")
            .populate([
                {
                  path:'posts',
                  model:'Posts',
                  populate:[{
                    path:'user',
                    model:'User', 
                    select:'_id username avatar_url' 
                  },
                  {
                    path:'summary.owner',
                    path :'User',
                    select:'_id username avatar_url'
                  },
                  {
                      path: 'summary.originalPost',
                      model:'Posts',
                      select:'_id content created_at hasMedia media'

                  },
                  {
                    path:'comments',
                    model:'Comment',
                    populate:[{
                        path:'user',
                        model:'User', 
                        select:'_id username avatar_url'   
                    },
                    {
                        path: 'replies',
                        model:'CommentReply'
                    }
                ]    
                  },
                {
                    path:'summary.owner',
                    model:'User',
                    select:'_id username avatar_url' 
                }]  
                },
                {
                  path:'nakamas',
                  model:'User'  
                },
                {
                    path:'friendRequests',
                    model:'Friendship',
                    populate:{
                        path:'from',
                        model:'User',
                        select:'username _id avatar_url'
                    }
                }
            ]);

         // if auth is the profile owner...   
            if(req.user === req.params.id){
                const profile ={
                    username: user.username,
                    avatar_url: user.avatar_url,
                    nakamas: user.nakamas,
                    personalInfos: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        telephone: user.telephone,
                        birthdate: user.birthDate,
                        email: user.email
                    },
                    photos: user.photos,
                    posts: user.posts,
                    friendReqs: user.friendRequests,
                    user: user._id,
                    created_at: user.created_at
                }
               return res.status(202).json({
                    profile: profile,
                    success: true,
                    message:'profile has been accessed successfully'
            });

            }else if(user.nakamas.map(nakama => nakama._id.toString()).indexOf(req.user) > -1){
            
        // if auth is a nakama....
            const profile ={
                    username: user.username,
                    avatar_url: user.avatar_url,
                    nakamas: user.nakamas,
                    personalInfos: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        telephone: user.telephone,
                        birthdate: user.birthDate,
                        email: user.email
                    },
                    photos: user.photos,
                    posts: user.posts,
                    user: user._id,
                    created_at: user.created_at
                }
                res.status(202).json({
                    profile: profile,
                    success: true,
                    message:'profile has been accessed successfully'
                });

         // if auth is blacklisted....       
            }else if(user.blacklist.map(user => user._id.toString()).indexOf(req.user) > -1){
                return res.status(404).json({success:false, message:'Could not reach the user for personal issues'})

            }else{
         // if the auth is not a friend of the profile owner..
            const profile ={
                username: user.username,
                avatar_url: user.avatar_url,                    
                created_at: user.created_at,
                user: user._id

            }
            return res.status(202).json({
                profile: profile,
                success: true,
                message:'profile has been accessed successfully'
            })
            }
        }catch(e){
         return res.status(404).json({success: false, errors: e});
        }
    }else{
        return res.status(403).json({success: false, message: "Your are not authenticated yet"});
    }

}