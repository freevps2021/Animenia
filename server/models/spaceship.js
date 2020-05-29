const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const spaceship = new Schema({
    user:{type: Schema.Types.ObjectId, required: true, ref:'User'},
    astroName:{type:String, required:true},
    friends:[{type: Schema.Types.ObjectId, ref:'User'}],
    friendRequests:[{type: Schema.Types.ObjectId, ref:'Friendship'}],
    space:{type: Schema.Types.ObjectId, required: true, ref: 'Space'},
    space_avatar:{type:String, default:' '},
    posts : [{type: Schema.Types.ObjectId, ref:'Post'}]
});




module.exports = mongoose.model('Spaceship', spaceship);