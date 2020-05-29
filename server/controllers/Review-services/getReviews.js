const Post = require('../../models/post');
const Image = require('../../models/image');
const User = require('../../models/user');
const Anime = require('../../models/anime');
const Review = require('../../models/review');

const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


module.exports = async (req, res, next) =>{
    if(req.user){
        try{
            let anime;
            if(req.query.titleRomaj){
             anime = await Anime.findOne({"title.romaji": req.query.titleRomaji});

            }else if(req.query.titleEng){
             anime = await Anime.findOne({"title.eng": req.query.titleEng});

            }else if(req.query.anime){
             anime = await Anime.findById(req.query.anime);

            }else{
                return res.status(401).json({success: false, error: 'A search parameter should be applied!' }); 
  
            }
            if(anime !== 'undefined'){
                const reviews = await Review.find({anime: anime._id})
                               
                if(reviews){
                    return res.status(200).json({success: true, reviews});
                }
            }
        }catch(e){
            return res.status(404).json({success: false, error: e }); 
 
        }
    }
}

/*
module.exports = {

    // Based on Anime romaji title...
    ByRomajiTitle: async (req, res, next)=>{
        if(req.user){
            try{
                const anime = await Anime.findOne({"title.romaji": req.query.titleRomaji});
                const reviews = await Review.find({anime: anime._id})
                               
                if(reviews){
                    return res.status(200).json({success: true, reviews});
                }
            }catch(e){
                if(e){
                    return res.status(404).json({success: false, error: e }); 
                }
            }
        }else{
           return res.status(401).json({success: false, message: 'Unauthorized!'}) 
        }
    },
    // Based on Anime eng title...
    ByEngTitle: async (req, res, next)=>{
        console.log(req.query.title_eng)
        if(req.user){ 
            try{
                console.log(req.params.title_eng)
                const anime = await Anime.findOne({'title.eng': req.query.titleeng});
              
                const reviews = await Review.find({anime: anime._id})
                if(reviews){
                    return res.status(200).json({success: true, reviews:reviews});
                }
            }catch(e){
                if(e){
                    console.log(e);
                    return res.status(404).json({success: false, error: e }); 
                }
            }
        }else{
            console.log('Unauthorized')
           return res.status(401).json({success: false, message: 'Unauthorized!'}) 
        }
    },
    // Based on Date...
    ByDate: async (req, res)=>{
        if(req.user){
            try{
                const reviews = await Review.find({createdAt: req.query.createdAt})
                               
                if(reviews){
                    return res.status(200).json({success: true, reviews});
                }
            }catch(e){
                if(e){
                    return res.status(404).json({success: false, error: e }); 
                }
            }
        }else{
           return res.status(401).json({success: false, message: 'Unauthorized!'}) 
        }
    },
    // Based on Ratings...

    // Based on number of downvotes...

    // Based on number of upvotes...

    // Based on Anime id...
    ByAnimeId: async (req, res)=>{
        if(req.user){
            try{
                const reviews = await Review.find({anime: req.query.anime_id})
                             ;
                if(reviews){
                    return res.status(200).json({success: true, reviews});
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
    // Based on user...

    // Based on Anime and Rating...

    // Based on Anime & most Rated... 
}

*/

