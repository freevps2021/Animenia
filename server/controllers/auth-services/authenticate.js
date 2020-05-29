// models
const User = require('../../models/user');
const Post = require('../../models/post');
const Image = require('../../models/image');
// packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');



module.exports = async(req, res)=>{
    if(!req.body.username || !req.body.password){
       return res.status(401).json({
            error:'no match'
        })
    }

    try{
        const user = await User.findOne({username:req.body.username});
        if(user){
            if(!user.isVerified){
                res.status(401).json({success: false, errors:'Your account hasn\'t been verified.'});
            }else{
                bcrypt.compare(req.body.password, user.password, (err, userData)=>{
                    if(err){
                        res.status(401).json({success: false, errors:err});
                    }
                    jwt.sign({username: req.body.username, id: user._id}, process.env.JWT_SECRET, (err, token)=>{
                        if(err){
                            return res.json({status: 401, success:false, err:err})
                        }
                        if(token){
                            return res.json({status:200, success: true, token: token, authData: user, message:'You have logged in successfully.'})
                        }
                    });
                    
                
                  
                })
            }
          
        }else{
            return res.status(404).json({success:false, message:'Login Failed, user not found!'});

        }
    }catch(err){
        if(err){
            return res.json({status:404, success:false, message:'Login Failed!', error: err});
 
        }
    }
    
}