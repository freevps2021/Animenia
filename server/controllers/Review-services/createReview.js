const Post = require('../../models/post');
const Image = require('../../models/image');
const User = require('../../models/user');
const Review = require('../../models/review');
const Anime = require('../../models/anime');

const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');



module.exports = async (req, res)=>{
    if(req.user){
       try{
        const checkReviews = await Review.find({user: req.user, anime: req.body.anime_id});
        if (checkReviews.length > 0){
            return res.status(401).json({success: false, message: 'You have already reviewd that anime!' });

        }else{
         // check if all required data are present...
        if(req.body.anime_id && req.body.rating && req.body.summary.trim()!== ' '){
            const review = new Review();
            const anime = await Anime.findById(req.body.anime_id);
            review.user = req.user;
            review.anime = req.body.anime_id;
            review.summary = req.body.summary;
            review.rating = req.body.rating;
            const savedReview = await review.save();
            const auth = await User.findById(req.user);
            auth.reviews.push(savedReview._id);
            const updateUser = await auth.save();
 
            switch(req.body.rating){
                case '1':
                    anime.stars['1'] += 1;
                    anime.reviews+=1;
                    break;
                case '2':
                    anime.stars['2'] += 1;
                    anime.reviews+=1;
                    break;
                case '3':
                    anime.stars['3'] += 1;
                    anime.reviews+=1;
                    break;
 
                case '4':
                    anime.stars['4'] += 1;
                    anime.reviews+=1;
                    break;
 
                case '5':
                    anime.stars['5'] += 1;
                    anime.reviews+=1;
                    break;
 
            }
            const savedAnime = await anime.save();
 
            return res.status(200).json({success: true, message:'Review Added successfully!', savedAnime}) 
         }else{
             return res.status(401).json({success: false, message: 'Please add the missing details' });
 
         }
        }
       }catch(e){
           return res.status(404).json({success: false, error: e });
       } 
    }
}