const Post = require('../../models/post');
const Image = require('../../models/image');
const User = require('../../models/user');
const Anime = require('../../models/anime');
const Review = require('../../models/review');

const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


module.exports = async (req, res)=>{
    if(req.user){
        try{
          const review = await Review.findById(req.params.id);
          if(req.user === review.user.toString()){
                const auth = await User.findById(req.user);
                if(auth.reviews.map(r => r.toString()).indexOf(req.params.id) > -1){
                    auth.reviews.slice(auth.reviews.map(r => r.toString()).indexOf(req.params.id), 1);
                    await auth.save();
                    const anime = await Anime.findById(review.anime);
                    anime.reviews -=1;
                    anime.stars[review.rating] -=1;
                    await anime.save();
                    const delReview = await review.remove();
                    return res.status(200).json({success: true, message: 'Review Deleted Successfully!'})
                }else{
                    return res.status(404).json({success: false, message: 'Review Not Found in the User\'s Reviews!' });   

                }
          }else{
            return res.status(403).json({success: false, message: 'Only Reviewer could remove that review!' });   
          }   
        }catch(e){
            return res.status(404).json({success: false, error: e });
        }
    }
}