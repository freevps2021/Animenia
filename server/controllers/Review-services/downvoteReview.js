const Post = require('../../models/post');
const Image = require('../../models/image');
const User = require('../../models/user');
const Anime = require('../../models/anime');
const Review = require('../../models/review');

const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');



module.exports = async (req, res) => {
    if(req.user){
        try{
           const review = await Review.findById(req.params.id);
           const upvoters = review.upvoters.map(voter => voter.toString());
           const downvoters = review.downvoters.map(voter => voter.toString());

           // check if the auth is the upvoter...
           if(req.body.voter === review.user.toString()){
            return res.status(401).json({success: false, message: " You Cannot up- or downvote your own review."});

           }else{
            // check if the auth has upvoted the review
            if(upvoters.indexOf(req.body.voter) > -1){
                review.upvoters.splice(upvoters.indexOf(req.body.voter));
                review.downvoters.push(req.body.voter);
                review.upvotes -= 1;
                review.downvotes += 1;
                const updatedReview = await review.save();
                if(updatedReview){
                    return res.status(200).json({success: true, message: 'You downvoted this review.', review: updatedReview});
                }
            // toggle downvote if there...
            }else if(downvoters.indexOf(req.body.voter) > -1){
                review.downvoters.splice(downvoters.indexOf(req.body.voter));
                review.downvotes -= 1;
                const toggledDownvotedReview = await review.save();
                if(toggledDownvotedReview){
                    return res.status(200).json({success: true, message: 'Downvote dismissed'});
                }
            }else{
                review.downvoters.push(req.body.voter);
                review.downvotes +=1;
                const downvoted = await review.save();
                if(downvoted){
                    return res.status(200).json({success: true, message: 'You downvoted that review'});
                }
            }
           }
           
 
        }catch(e){
            if(e){
             return res.status(401).json({success: false, errors: e});
   
            }
        }
    }else{
        return res.status(403).json({success: false, message: 'Autentication Failed!'})
    }
}