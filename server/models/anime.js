const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const anime = new Schema({
      title:{
          eng: {type: String, required: true},
          romaji:{type: String, required: true}
       },
       reviews: { type: Number, default: 0},
       stars:{
           1:{type: Number, default:0},
           2:{type: Number, default:0},
           3:{type: Number, default:0},
           4:{type: Number, default:0},
           5:{type: Number, default:0}
       },
       genre:{type: String, required: true},
       summary: { type: String, required: true},
       status: { type: String, required: true},
       author: { type: String, required: true},
       first_aired:{ type: Date, required: true},
       createdAt: { type: Date, default: new Date()},
       updatedAt: { type: Date}

});


module.exports= mongoose.model('Animes', anime);