// models
const User = require('../../models/user');
const Post = require('../../models/post');
const Image = require('../../models/image');
// packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');




module.exports = async (req, res)=>{
    const searchTerm = req.query.name;
    User.find({}, (err, users)=>{
        if(err){
            return res.status(404).json({message:'could not complete search', err:err})
        }        
        const result = [];
        users.forEach(user =>{
            if(searchTerm.toLowerCase() === user.username.substring(0, searchTerm.length).toLowerCase()){
                result.push(user);
            }
        })
        return res.status(200).json({searchResult: result});
      
    })
    
/*
    const result = await User.find({
        username:{
            $regex: searchTerm, $options: 'i'
        }
}).select('-password');

    if(!result){
        return res.status(404).json({succes: false, message:'could not complete search'});

    }
    if(result && result.length < 1){
        return res.status(404).json({success: false, message:'could not find any matching'});
    }else{
        return res.status(202).json({succes: true, result});

    }
    */
    
    /*
    User.find({
        $text:{
            $search: searchTerm
        }
}, (err, users)=>{
        if(err){
            return res.status(404).json({message:'could not complete search', err:err})
        }
        console.log(users);
        
        const result = [];
        users.forEach(user =>{
            if(searchTerm.toLowerCase() === user.username.substring(0, searchTerm.length).toLowerCase()){
                result.push(user);
            }
        })
        return res.status(200).json({searchResult: result});
      
    })
    
      */
}