const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const comment = new Schema({
    user:{type: Schema.Types.ObjectId, ref:'User', required:true},
    post_id:{type:Schema.Types.ObjectId, ref:'Posts', required:true},
    content:{type:String, required:true},
    replies:[{type: Schema.Types.ObjectId, ref:'CommentReply'}],
    likes:[{type: Schema.Types.ObjectId, ref:'CommentLike'}],
    dislikes:[{type: Schema.Types.ObjectId, ref:'CommentDislike'}],
    created_at:{type: Date, required:true}
})

module.exports = mongoose.model('Comment', comment);
