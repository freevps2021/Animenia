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
            const review = await Review.findById(req.params.id)
                            .populate([{
                                path: 'anime',
                                model: 'Animes'
                            },
                            {
                                path: 'user',
                                model : 'User',
                                select: '_id avatar_url username'
                            }
                        ]);
            if(review){
                return res.status(200).json({success: true, review});
            }
        }catch(e){
            if(e){
                return res.status(404).json({success: false, error: e }); 
            }
        }
    }else{
       return res.status(401).json({success: false, message: 'Unauthorized!'}) 
    }
}