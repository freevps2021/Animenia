const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const dislike = new Schema({
    disliker:{type: Schema.Types.ObjectId, ref: 'Spaceship', required:true},
    post:{type:Schema.Types.ObjectId, required:true}

})


module.exports = mongoose.model('Dislike', dislike);
