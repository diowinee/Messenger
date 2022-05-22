const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    login:{
        type:String,
        get: v => '@'+v,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    friends:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:'User'
        }]
    },
    requests:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:'User'
        }]
    },
    photo:{
        type:String
    },
    offline:{
        type:Date,
        default:Date.now(),
        required:true
    }
});

const User = mongoose.model('User',UserSchema);
module.exports = User;