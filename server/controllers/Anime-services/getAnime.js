const Post = require('../../models/post');
const Image = require('../../models/image');
const User = require('../../models/user');
const Anime = require('../../models/anime');
const Review = require('../../models/review');

const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');




module.exports  = async (req, res) => {
    if(req.user){
        try{
            let anime;
            if(req.query.titleRomaji){
                anime = await Anime.findOne({"title.romaji": req.query.titleRomaji});
            }else if(req.query.titleEng){
                anime = await Anime.findOne({"title.eng": req.query.titleEng});
            }else if(req.query.id){
                anime = await Anime.findById(req.query.id);
            }

            if(anime){
                return res.status(200).json({success: true, anime});
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

