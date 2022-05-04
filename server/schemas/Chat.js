const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    isPrivate:{
        type:Boolean,
        default:'false',
        required:true
    },
    title:{
        type:String,
        required: ()=>{
            return this.isPrivate === true;
        }
    },
    creater:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    photo:{
        type:String
    },
    users:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:'User'
        }]
    },
    messages:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:'Message'
        }]
    }
});

const Chat = mongoose.model('Chat',ChatSchema);
module.exports = Chat;