const STATUS = ['LOADING','SEND','UNREAD'];
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    status: {
        type:String,
        required:true,
        enum:STATUS
    },
    createdDate:{
        type:Date,
        required:true,
        default:Date.now
    },
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    modelId:{
        type:Schema.Types.ObjectId,
        required:true,
        refPath:'models'
    },
    models:{
        type:String,
        required:true,
        enum:['FileMessage','TextMessage']
    }
});

const Message = mongoose.model('Message',MessageSchema);
module.exports = Message;