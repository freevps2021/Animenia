const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const review = new Schema({
   anime: { type: Schema.Types.ObjectId, ref:'Animes', required: true},
   user: { type: Schema.Types.ObjectId, ref:'User', required: true},
   summary: {type: String, required: true},
   rating:{ type: Number, required: true},
   upvoters: [{type: Schema.Types.ObjectId, ref: 'User'}],
   downvoters: [{type: Schema.Types.ObjectId, ref: 'User'}],
   upvotes:{type: Number, default: 0}, 
   downvotes:{type: Number, default: 0},
   createdAt:{type: Date, default: new Date()},
   updatedAt:{type: Date, default: new Date()}
});


module.exports= mongoose.model('Reviews', review);