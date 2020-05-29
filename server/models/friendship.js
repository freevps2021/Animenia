const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const friendRequest = new Schema({
    from:{type: Schema.Types.ObjectId, required: true , ref:'User'},
    to:{type: Schema.Types.ObjectId, required: true , ref:'User'},
    status:{type: String, requried: true, default: 'pending'}
});


module.exports= mongoose.model('Friendship', friendRequest);