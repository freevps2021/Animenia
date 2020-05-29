const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const replyLike = new Schema({
    liker:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
})

const replyDislike = new Schema({
    disliker:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
})

const commentReply = new Schema({
    user:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    post:{type: mongoose.Schema.Types.ObjectId, ref:'Posts'},
    likes:[replyLike],
    dislikes:[replyDislike],
    comment:{type: mongoose.Schema.Types.ObjectId, ref:'Comment'},
    content:{type:String, required:true},
    created_at:{type: Date, required:false}

})




module.exports = mongoose.model('CommentReply', commentReply);
