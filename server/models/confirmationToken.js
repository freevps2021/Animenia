const mongoose = require('mongoose');
const Schema = mongoose.Schema;






const confirmationToken = new Schema({
    user: {type: Schema.Types.ObjectId, required: true},
    token: {type: String, required: true},
    createdAt:{type: Date, default: Date.now(), expires: 43200}
});










module.exports = mongoose.model('ConfirmationToken', confirmationToken);
