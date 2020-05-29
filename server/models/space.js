const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const space = new Schema({
    name:{type:String, required: true},
    category:{type:String, required: true},
    memberCount:{type: Number, required: true, default:0},
    postCount:{type: Number, required: true, default:0},
    bgURL:{type:String, default: null}
});

module.exports = mongoose.model('Space', space);