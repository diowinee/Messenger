const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FileMessageSchema = new Schema({
    path:{
        type:String,
        required:true
    },
    extension:{
        type:String,
        required:true
    }
});

const FileMessage = mongoose.model('FileMessage',FileMessageSchema);
module.exports = FileMessage;