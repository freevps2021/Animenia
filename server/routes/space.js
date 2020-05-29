const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');
const Spaceship = require('../models/spaceship');
const Space = require('../models/space');


// check token middelware
 async function checkToken(req, res, next) {
    if(req.headers.authorization !=='undefined'){
        let bearerToken = req.headers.authorization.split(' ');
        const token = bearerToken[1];
        try{
            let auth = await jwt.verify(token, process.env.JWT_SECRET);
            if(auth != null || auth !=='undefined'){
                req.user = auth.id;
            }
        }catch(err){
            if(err){
                console.log(err);
                res.json({status:401, err:err, message:'Authorization Failed!'});
                return;
            }
        }
    }
    next();
     
 }


 // get all available spaces

 router.get('/spaces-list', checkToken, async (req, res)=>{
    
     if(req.user !== 'undefined'){
        try{
            const auth= await User.findById(req.user);
            //const ids = authSpaces.map(s => s.toString());
            const authSpaces = auth.spaces;
            const spaces = await Space.find({_id:{$nin: authSpaces}});
     
            if(spaces.length > 0){
              return res.json({status: 201, success: true, spaces: spaces}); 
            }else{
             return res.json({status: 404, success: false, message: 'No Spaces available! You might be subscribed in all spaces, if not please report to us.'});    
            }
        }catch(err){
            if(err){
                console.log(err);
                return res.json({status: 404, success: false, err:err}); 
   
            }
        }
       
     }else{
      return res.json({status: 401, success: false, message: 'Authentication Failed!'})   
     }
 })

router.get('/:id', checkToken, async (req, res)=>{
   const space = req.params.id;
   if(req.user !== 'undefined'){
     try{
       let spaceship = await Spaceship.findOne({user: req.user, space: space})
                      .populate([
                        {
                         path:'user',
                         model:'User',
                         select: '_id username spaces'   
                        },
                        {
                            path:'space',
                            model:'Space',
                            select: '_id name'   
                        },
                        {
                         path: 'friends',
                         model: 'Spaceship',
                         select: '_id astroName user space_avatar space posts',
                         populate:{
                          path: 'posts',
                          model: 'Post',
                          populate: [{
                              path: 'comments',
                              model: 'Comment',
                              populate:[{
                               path: 'replies',
                               model: 'CommentReply'   
                              },
                              {
                               path: 'likes',
                               model: 'CommentLike'   
                              },
                              {
                               path: 'dislikes',
                               model: 'CommentDislike'   
                              }
                            ]
                          },
                          {
                            path: 'likes',
                            model: 'Like'   
                          },
                          {
                            path: 'dislikes',
                            model: 'Dislike'    
                          }
                        ]   
                         }  
                        }  
                      ]);
        if(spaceship !== 'undefined' || spaceship !== null){
            res.json({status: 201, success: true, spaceship: spaceship});
        }                 
     }catch(err){
      if(err){
          console.log(err);
        return res.json({status: 404, success: false, err: err});  
      }   
     }  
   }else{
    console.log('No Auth');   
    return res.json({status: 403, success: false, message: 'Authorization Failed!'});     
   }
});

// get spaces of the authenticated user...
router.get('/:user', checkToken, async (req, res)=>{
 if(req.user !=='undefined'){
    try{
     let user = await User.findById(req.user)
     .populate({
         path: 'spaces',
         model: 'Space',
         select:'_id name bgURL'
     });
     if(user){
         return res.json({status:202, success: true, spaces: user.spaces})
     }
    }catch(err){
        if(err){
            console.log(err);
            res.json({status:404, succes:false, err:err});
            return;
        }
    } 
 }
})

router.get('/:user/posts', checkToken, async(req, res)=>{
    if(req.user !== 'undefined'){
        try{
          let space = req.query.space;
          const spacePosts = await Post.find({user: req.user, space: space})
          .populate([{
            path:'comments',
            model:'Comment',
            populate:[{
                path:'user',
                model:'User',
                select:'username _id avatar_url' 
            },
            {
                path:'replies',
                model:'CommentReply',
                populate:{
                    path:'user',
                    model:'User',
                    select:'_id username avatar_url'
                }    
            },
            {
                path:'likes',
                model:'CommentLike',
            },
            {
                path:'dislikes',
                model:'CommentDislike',
            }
        ]
        },
        {
            path:'user',
            model:'User',
            select:'username _id avatar_url'   
        },
        {
            path:'likes',
            model:'Like',
            populate:{
                path:'liker',
                model:'User',
                select:'username _id avatar_url' 
            }   
        },
        {
            path:'dislikes',
            model:'Dislike',
            populate:{
                path:'disliker',
                model:'User',
                select:'username _id avatar_url' 
            }  
        },
        {
            path:'summary.owner',
            model:'User',
            select:'username _id avatar_url'   
        }]);
        if(spacePosts !== 'undefined' || spacePosts != null){
           return res.json({status:200, success:true, posts:spacePosts});
        }   
        }catch(err){
            console.log(err);
            res.json({success:false, status:404, err:err});
            return;
        }
    }
})


// get friends of the space
router.get('/:user/friends', checkToken, async(req, res)=>{
  if(req.user !== 'undefined' || req.user != null){
    const space = req.query.space;
    try{
     const user = User.findById(req.user)
                  .populate({
                      path:'friends',
                      model:'User',
                      select:'_id username avatar_url spaces'
                  });
        const spaceFriends = user.friends.map(friend => friend.spaces.filter(spacename => spacename === space));
        if(spaceFriends !== 'undefined' || spaceFriends != null){
            return res.json({status:200, success:true, spaceFriends:spaceFriends});
         }   
    }catch(err){
        if(err){
            console.log(err);
            res.json({status:404, success:false, err:err});
            return;
        }
    }
  }
})

/* Add Space from admin panel*/
router.post('/admin/add-space', checkToken, async(req, res)=>{
   if(req.user !== 'undefined'){
       try{
        let auth = await User.findById(req.user);
        const space = new Space({
           name: req.body.name,
           category: req.body.category 
        });

        space.save(err=>{
          if(err){
            console.log(err);
            return res.json({status:404, success:false, err:err})   
          }
          return res.json({status:202 , success:true, message:'Space created successfully!'}) 
  
        })
       }catch(err){
        if(err){
           console.log(err);
           return res.json({status:404, success:false, err:err}) 
        }   
       }
   }else{
    console.log('Auth failed')   
    return res.json({status:403, success:false, message:'Authentication Failed!'})   
   } 
}) 

// subscribe to a space
router.post('/subscribe', checkToken, async(req, res)=>{
    if(req.user !== 'undefined'){
      const auth = await User.findById(req.user);
      if(auth){
          const spacesID = auth.spaces.map(id => id.toString());
          // check if the space has been already subscribed...
          if(spacesID.indexOf(req.query.space_id) > -1){
            return res.json({status:403, success:false, message:'Space already subscribed!'});   
          }else{
              // check if there was a spaceship for this space before of that user...
            const findSpaceship = await Spaceship.findOne({space: req.query.space_id, user: req.user});
            if(findSpaceship){
                // just restore the ship..
                auth.spaceships.push(findSpaceship._id);
                auth.spaces.push(req.query.space_id);
                auth.save(err =>{
                    if(err){
                       return res.json({status:404, err:err, success:false, message:'Couldn\'t restore your spaceship'})   
                    }
                       return res.json({status:202, success:true, message:'Space subscribed & spaceship restored successfully.'});   
       
                   })
            }else{
                // if first time subscription create the spaceship...
                const spaceship = new Spaceship({
                    user: auth._id,
                    astroName: auth.username,
                    space: req.query.space_id  
                  });
                  
                  spaceship.save(err => {
                   if(err){
                      return res.json({status:404, success:false, err: err});   
                      }
                  // add spaceship to the user spaceships..
                  auth.spaceships.push(spaceship._id);
                  // add the space to the user doc...    
                  auth.spaces.push(req.query.space_id);
                  auth.save(err =>{
                   if(err){
                      return res.json({status:404, success:false, message:'Couldn\'t add space to the user!'})   
                   }
                      return res.json({status:202, success:true, message:'Space Subscribed successfully.'});   
      
                  })
                  }) 
            }  
             
           
          }
       
      }else{
        return res.json({status:403, success:false, message:'Authenticated User Not Found!'})   
      }
    }else{
    return res.json({status:403, success:false, message:'Authentication Failed!'})   
    }
})

// unsubscrine from a space

router.post('/unsubscribe', checkToken, async(req, res)=>{
    if(req.user){
        const space = req.query.id; // space id
        console.log(space);
        try{
          const auth = await User.findById(req.user);
          if(auth){
            // check if the spaces list of a user contains the space to unsubscribe from
            const authSpaces = auth.spaces.map(space => space.toString());
            if(authSpaces.indexOf(space) > -1){
                // delete the spaceship
                auth.spaces.splice(auth.spaces.indexOf(space), 1);
                auth.save(err=>{
                    if(err){
                      return res.json({status:404, success:false, err:err, message:'Couldn\'t unsubscribe from space.!'});
                    }
                    return res.json({status:200, success:true, message:'Unsubscription Done! In case of subscribing again your spaceship will be back up.'})   

                })
            }else{
                return res.json({status:404, success:false, message:'Space is not subscribed!!'})   
 
            }
          }else{
            return res.json({status:404, success:false, message:'User not found!!'})   
   
          }  
        }catch(err){
            if(err){
                return res.json({status:404, success:false, err:err})       
            }
        }
    }else{
      return res.json({status:403, success:false, message:'Authentication Failed!'})   
     
    }
})

// get the timeline of a certain space...
router.get('/:id/timeline', checkToken, async(req, res)=>{
  const space = req.params.id;
  console.log(space);
  if(req.user){
    try{
        const spaceship = await Spaceship.findOne({user: req.user, space: space})
        .populate([
            {
             path: 'friends',
             model:'Spaceship'   
            },
            {
             path: 'friendRequests',
             model: 'Friendship'   
            },
            {
              path: 'space',
              model: 'Space',
              select: '_id name'  
            }
        ]);
        const timelinePosts = await Post.find({user: [spaceship.user, ...spaceship.friends], space: space})
        .sort('-created_at')
        .populate([{
            path:'comments',
            model:'Comment',
            populate:[{
                path:'user',
                model:'Spaceship',
                select:'astroName _id avatar_url' 
            },
            {
                path:'replies',
                model:'CommentReply',
                populate:{
                    path:'user',
                    model:'Spaceship',
                    select:'_id astroName avatar_url'
                }    
            },
            {
                path:'likes',
                model:'CommentLike',
            },
            {
                path:'dislikes',
                model:'CommentDislike',
            }
        ]
        },
        {
            path:'user',
            model:'Spaceship',
            select:'astroName _id avatar_url'   
        },
        {
            path:'likes',
            model:'Like',
            populate:{
                path:'liker',
                model:'Spaceship',
                select:'astroName _id avatar_url' 
            }   
        },
        {
            path:'dislikes',
            model:'Dislike',
            populate:{
                path:'disliker',
                model:'Spaceship',
                select:'astroName _id avatar_url' 
            }  
        },
        {
            path:'summary.owner',
            model:'Spaceship',
            select:'astroName _id avatar_url'   
        }]);

     

        if(spaceship !== null && timelinePosts !== null){
            const spaceTimeline = {
                astronaunt: spaceship.astroName,
                posts: timelinePosts,
                friends: spaceship.friends,
                friendRequests: spaceship.friendRequests,
                space: spaceship.space,
                timeline_avatar: spaceship.space_avatar
            }
            return res.json({status: 202, success: true, timeline: spaceTimeline});

        }else{
            return res.json({status: 404, success: false, message: 'Couldn/t build space-timeline'});   
        }
    }catch(err){
        if(err){
            return res.json({status:403, success:false, err:err});   
        }
    }
  }else{
    return res.json({status:403, success:false, message:'Authentication Failed!'})      
  }  
})






module.exports = router;