// dependencies
const express = require('express');
const router = express.Router();
const multer = require('multer');

// models
const User = require('../../models/user');
const Image = require('../../models/image');

module.exports = async (req, res) => {
    // check if a file has been appended to the request...
    if(!req.file){
        return res.status(404).json({success:false,  message:'No files uploaded'});
        console.log('no file');
    }else{
        const user = await User.findById(req.params.id);
        user.avatar_url = req.protocol + "://" + 'localhost:3000/uploads/images/profile/' + req.file.filename;

        const updatedUser = await user.save();
        if(updatedUser){
            return res.status(200).json({success: true, message: "Avatar uploaded successfully."});
        }else{
            return res.status(404).json({success: false, message: "Uploading image failed."});
        }


    }
}