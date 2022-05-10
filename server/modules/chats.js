const { populate } = require('../schemas/Chat');
const Chat = require('../schemas/Chat');
module.exports.createChat = async(title,creater)=>{
    try{
        const chat = new Chat({
            'isPrivate':true,
            'title':title,
            'creater':creater,
            users:[creater]
        });
        const newChat = chat.save();
        if(!newChat) return;
        return newChat;
    }
    catch(e){
        return;
    }
}
module.exports.getChats = async (userId)=>{
    try{
        const chats = await Chat.find({$and:[
            {users:userId},
            {$or:[
                {isPrivate:true},
                {messages:{$ne:[]}}
            ]}
        ]}).populate({path: 'messages', populate: {path: 'modelId user'}}).populate({path:'users'})
        if(!chats) return;
        return chats;
    }
    catch(e){
        return;
    }
}
module.exports.openChat = async(chatId)=>{
    try{
        const chat = await Chat.findOne({_id:chatId},'_id messages isPrivate').populate({path: 'messages', populate: {path: 'modelId user'}});
        if(!chat) return;
        return chat;
    }
    catch(e){
        return;
    }
}