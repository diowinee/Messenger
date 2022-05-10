const text = require('body-parser/lib/types/text');
const { json } = require('express/lib/response');
const Chat = require('../schemas/Chat');
const Message = require('../schemas/Message');
const TextMessage = require('../schemas/TextMessage');
const User = require('../schemas/User');

const StatusMessage = {
    READ: "READ",
   UNREAD: "UNREAD"
};
const TypeMessage = {
    TextMessage:'TextMessage',
    FileMessage:'FileMessage'
}

module.exports.openDialog = async(userId,friendId)=>{
    try{
        const dialog = await Chat.findOne({$and:[
            {'isPrivate':false},
            {'users':{$all:[userId,friendId]}}
        ]},'_id messages isPrivate').populate({path: 'messages', populate: {path: 'modelId user'}});
        if(!dialog){
           return createDialog(userId,friendId);
        }
        return dialog;
    }
    catch(e){
        return;
    }
}

module.exports.sendMessage = async(chatId,type,messageText,userId)=>{
    try{
        if(type===TypeMessage.TextMessage){
            const textMes = new TextMessage({
                text:messageText
            });
            const textMessageResult = await  textMes.save();
            if(!textMessageResult._id) return;
            const message = new Message({
                status: StatusMessage.UNREAD,
                user:userId,
                models:type,
                modelId:textMessageResult._id
            });
            const messageResult = await message.save();
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

async function createDialog(userId,friendId){
    try{
        const dialog = new Chat({
            creater:userId,
            users:[userId,friendId]
       });
       const newDialog = await dialog.save();
       if(!newDialog) return;
       return dialog;
    }
    catch(e){
        return;
    }
}

module.exports.getParticipants = async(chatId)=>{
    try{
        const participants = await Chat.findOne({'_id':chatId}).populate('users');
        if(!participants) return;
        return participants;
    }
    catch(e){
        return;
    }
}
module.exports.getInfo = async(chatId)=>{
    try{
        const info = await Chat.findOne({'_id':chatId});
        if(!info) return;
        return info;
    }
    catch(e){
        return;
    }
}

module.exports.searchParticipants = async (searchText,chatId)=>{
    try{
        const participants = await Chat.findOne({'_id':chatId});
        //?
        const participantsSearch = User.find({$and:[
            {$or:[
                {'name':{$regex:`^${searchText}`,$options:'i'}},
                {'login':{$regex:`^${searchText}`,$options:'i'}}
            ]},
            {'_id':{$in:participants.users}}
        ]});
        if(!participantsSearch) return;
        return participantsSearch;
    } 
    catch(e){
        return;
    }
}

module.exports.addParticipant = async (chatId,userId)=>{
    try{
        const result = await Chat.updateOne({'_id':chatId},{$push:{users:userId}});
        if(!result) return;
        return result;
    }
    catch(e){
        return;
    }
}

module.exports.deleteParticipant = async (chatId,userId)=>{
    try{
        const result = await Chat.updateOne({'_id':chatId},{$pull:{users:userId}});
        if(!result) return;
        return result;
    }
    catch(e){
        return;
    }
}

module.exports.outputFriends = async (id,chatId)=>{
    try{
        //?
        const participants = await Chat.findOne({'_id':chatId});
        const friends = await User.findOne({'_id':id});
        const users = await User.find({$and:[
            {'_id':{$in:friends.friends}},
            {'_id':{$nin:participants.users}}
        ]})
        if(!users) return;
        return users;
    }
    catch(e){
        return;
    }
}

module.exports.searchFriends = async (searchText,id,chatId)=>{
    try{
        //?
        const participants = await Chat.findOne({'_id':chatId});
        const friends = await User.findOne({'_id':id});
        const users = await User.find({$and:[
            {'_id':{$in:friends.friends}},
            {'_id':{$nin:participants.users}},
            {$or:[
                {'name':{$regex:`^${searchText}`,$options:'i'}},
                {'login':{$regex:`^${searchText}`,$options:'i'}}
            ]},
        ]})
        if(!users) return;
        return users;
    } 
    catch(e){
        return;
    }
}

module.exports.editChat = async (chatId,title) =>{
    try{
        const result = await Chat.updateOne({'_id':chatId},{'title':title});
        if(!result) return;
        return result;
    }
    catch(e){
        return;
    }
}

module.exports.logout = async (chatId, userId) =>{
    try{
        const result = await Chat.updateOne({'_id':chatId},{$pull:{'users':userId}});
        if(!result) return;
        return result;
    }
    catch(e){
        return;
    }
}