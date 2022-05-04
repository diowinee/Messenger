const text = require('body-parser/lib/types/text');
const Chat = require('../schemas/Chat');
const Message = require('../schemas/Message');
const TextMessage = require('../schemas/TextMessage');

module.exports.openDialog = async(userId,friendId)=>{
    try{
        const dialog = await Chat.findOne({$and:[
            {'isPrivate':false},
            {'users':{$all:[userId,friendId]}}
        ]},'_id messages').populate({path: 'messages', populate: {path: 'modelId user'}});
        if(!dialog){
           const chat = new Chat({
                creater:userId,
                users:[userId,friendId]
           });
           const newChat = await chat.save();
           if(!newChat) return;
           return chat;
        }
        return dialog;
    }
    catch(e){
        return;
    }
}

module.exports.sendMessage = async(chatId,type,message,userId)=>{
    try{
        if(type==='TextMessage'){
            const textMes = new TextMessage({
                text:message
            });
            const textMessageResult = await  textMes.save();
            if(!textMessageResult._id) return;
            const mes = new Message({
                status:'UNREAD',
                user:userId,
                models:type,
                modelId:textMessageResult._id
            });
            const messageResult = await mes.save();
            if(!messageResult._id) return;
            const result = await Chat.updateOne({'_id':chatId},{$push:{messages:messageResult._id}});
            if(!result) return;
            return result;
        }
    }
    catch(e){
        return
    }
}

module.exports.getMessage = async(chatId)=>{
    try{
        const dialog = await Chat.findOne({'_id':chatId},'messages').populate({path: 'messages', populate: {path: 'modelId user'}});
        if(!dialog) return;
        return dialog;
    }
    catch(e){
        return;
    }
}