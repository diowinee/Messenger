const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TextMessageSchema = new Schema({
    text:{
        type:String,
        required:true
    }
});

const TextMessage = mongoose.model('TextMessage',TextMessageSchema);
module.exports = TextMessage;