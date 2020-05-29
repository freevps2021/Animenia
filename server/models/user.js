const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const userSchema = new Schema({
    username:{type: String, required: true},
   // gender: {type: String, required: true},
    roles:[{type: String}],
    avatar_url: {type: String, required: false},
    profile_status:{type: Number, default: 1}, // 1 is incomplete, 2 is completed..
    isLogged:{type: Boolean, default: false},
    isVerified: {type: Boolean, default: false},
    posts:[{type: Schema.Types.ObjectId , ref: 'Posts'}],
    photos:[{type: Schema.Types.ObjectId , ref: 'Images'}],
    drawings:[{type: Schema.Types.ObjectId , ref: 'Drawings'}],
    drawing_rating:{type: Number, default:0},
    reviews:[{type: Schema.Types.ObjectId , ref: 'Reviews'}],
    reviews_rating:{type: Number, default:0},
    events:[{type: Schema.Types.ObjectId , ref: 'Events'}],
    email:{type: String, required: true},
    nakamas:[{type: Schema.Types.ObjectId, ref:'User'}],
    friendRequests:[{type: Schema.Types.ObjectId, ref:'Friendship'}],
    firstName:{type: String},
    lastName:{type: String},
    birthDate: {type: Date},
    telephone:{type: Number},
    created_at: {type: Date, required: true},
    admin: { type:Boolean, default: false},
    password:{type:String, required:true},
    passwordResetToken:{type: String},
    passwordResetTokenExp:{type: Date},
    blacklist:[{type: Schema.Types.ObjectId, ref:'User'}]
});

userSchema.index({username: 'text', email: 'text'});

module.exports = mongoose.model('User', userSchema);