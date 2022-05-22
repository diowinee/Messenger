const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FileMessageSchema = new Schema({
    extension:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    size:{
        type:Schema.Types.Number,
        required:true
    }
});

const FileMessage = mongoose.model('FileMessage',FileMessageSchema);
module.exports = FileMessage;