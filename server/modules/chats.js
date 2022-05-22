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
        ]}).populate({path: 'messages', populate: {path: 'modelId user'}}).populate({path:'users'}).sort({messages: -1})
        if(!chats) return;
        return sortingСhats(chats);
    }
    catch(e){
        return;
    }
}
module.exports.openChat = async(chatId)=>{
    try{
        const chat = await Chat.findOne({_id:chatId}).populate({path: 'messages', populate: {path: 'modelId user'}}).populate({path:'users'});
        if(!chat) return;
        return chat;
    }
    catch(e){
        return;
    }
}

function sortingСhats(chats){
    let sortChats = [];
    chats.forEach(chat => {
        sortChats.push(chat);
    });
    sortChats.sort((a,b)=>{
        if(a.messages.length===0) a = a.createdDate;
        else a = a.messages[a.messages.length-1].createdDate;
        if(b.messages.length===0) b = b.createdDate;
        else b = b.messages[b.messages.length-1].createdDate;
        return new Date(b) - new Date(a);
    })
    return sortChats;
}