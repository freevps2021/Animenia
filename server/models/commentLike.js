const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const commentLikes = new Schema({
    user:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    comment_Id:{type: mongoose.Schema.Types.ObjectId, ref:'Comment'}
})



module.exports = mongoose.model('CommentLike', commentLikes);
