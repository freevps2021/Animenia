const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;





const postSchema = new Schema({
    user:{type: Schema.Types.ObjectId, ref:'User', required:true},
    isOriginal:{type: Boolean, required:true},
    summary:{
        owner:{type: Schema.Types.ObjectId, ref:'User'},
        originalPost:{type: Schema.Types.ObjectId, ref:'Posts'}
      
    },
    content: {type: String, required: true},
    comments:[{type: Schema.Types.ObjectId, ref:'Comment'}],
    likes : [{type: Schema.Types.ObjectId, ref:'Like'}],
    dislikes:[{type: Schema.Types.ObjectId, ref:'Dislike'}],
    shares: {type: Number, required: true, default:0},
    created_at: {type: Date, required: true},
    hasMedia:{type:Boolean, default:false},
    media:{type: String}
});


module.exports = mongoose.model('Posts', postSchema);
