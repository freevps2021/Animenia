// models
const User = require('../../models/user');
const Post = require('../../models/post');
const Image = require('../../models/image');

// packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer'); 
const { check, validationResult } = require('express-validator');


async function changeAddress(user, newAddress){
const {country, zipcode, city} = newAddress;

}


async function changeDisplayName(req, res){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({success: false, errors});

    }

    if(req.user){
        try{
            const user = await User.findById(req.user);
            user.username = req.body.displayname;
            const savedUser = await user.save();
            if(savedUser){
                return res.status(202).json({success: true, message: "Displayname updated"});
            }else{
                return res.status(404).json({success: false, message: " Couldn\'t update display-name"});

            }

        }catch(e){
            if(e){
                return res.status(404).json({success: false, errors: e});
  
            }
        }
    }else{
        return res.status(403).json({success: false, message: 'Authentication failed'});
    }
}


async function changeDateOfBirth(req, res){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({success: false, errors});

    }

    if(req.user){
        try{
            const user = await User.findById(req.user);
            user.birthDate = req.body.birthDate;
            const savedUser = await user.save();
            if(savedUser){
                return res.status(202).json({success: true, message: "Date of birth updated"});
            }else{
                return res.status(404).json({success: false, message: " Couldn\'t update date of birth"});

            }

        }catch(e){
            if(e){
                return res.status(404).json({success: false, errors: e});
  
            }
        }
    }else{
        return res.status(403).json({success: false, message: 'Authentication failed'});
    }
}


async function changePhoneNumber(req, res){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({success: false, errors});

    }

    if(req.user){
        try{
            const user = await User.findById(req.user);
            user.telephone = req.body.telephone;
            const savedUser = await user.save();
            if(savedUser){
                return res.status(202).json({success: true, message: "Phone Number updated"});
            }else{
                return res.status(404).json({success: false, message: " Couldn\'t update phone number"});

            }

        }catch(e){
            if(e){
                return res.status(404).json({success: false, errors: e});
  
            }
        }
    }else{
        return res.status(403).json({success: false, message: 'Authentication failed'});
    }
}


async function changeEmail(req, res){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({success: false, errors});

    }
    
    if(req.user){
        try{
            const user = await User.findById(req.user);
            user.email = req.body.email;
            const savedUser = await user.save();
            if(savedUser){
                return res.status(202).json({success: true, message: "E-Mail updated"});
            }else{
                return res.status(404).json({success: false, message: " Couldn\'t update E-Mail"});

            }

        }catch(e){
            if(e){
                return res.status(404).json({success: false, errors: e});
  
            }
        }
    }else{
        return res.status(403).json({success: false, message: 'Authentication failed'});
    }
}

module.exports = {changeAddress, changeDisplayName, changeDateOfBirth, changeEmail, changePhoneNumber};