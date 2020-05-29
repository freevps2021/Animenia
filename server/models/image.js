const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Image= new Schema({
    user: {type: Schema.Types.ObjectId, required:true},
    date: {type: Date, required:true},
    category:{type:String, required:true},
    path: {type: String, required:true}
});



module.exports = mongoose.model('Images', Image);