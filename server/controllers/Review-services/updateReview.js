const Post = require('../../models/post');
const Image = require('../../models/image');
const User = require('../../models/user');
const Anime = require('../../models/anime');
const Review = require('../../models/review');

const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');



module.exports = async (req, res) =>{
    if(req.user){
        try{
            const review = await Review.findById(req.params.id);
            if(req.user === review.user.toString()){
                if(req.body.updatedContent && req.body.updatedContent.trim() !== ""){
                    review.summary = req.body.updatedContent;
                    const updatedReview = await review.save();
                    if(updatedReview){
                        return res.status(200).json({success: true, message: "Content updated Successfully!", review: updatedReview});
    
                    }
                }else{
                    return res.status(401).json({success: false, message: "Content must be provided!"})

                }
            }else{
                return res.status(401).json({success: false, message: "Only reviewer can update that review!"})
    
            }
        }catch(e){
            if(e){
                return res.status(401).json({success: false, errors: e});

            }
        }
     
    }else{
        return res.status(403).json({success: false, message: "Authentication Failed!"})
    }
}