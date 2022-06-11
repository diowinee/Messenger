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

module.exports.searchMessages = async(searchValue,userId)=>{
    try{
        const chats = await Chat.find({users:{$in:userId}}).populate({path: 'messages', match:{models:'TextMessage'}, populate: {path: 'modelId',match:{text:{$regex:`${searchValue}`,$options:'i'}}}}).populate({path:'users'}).sort({messages: -1});
        if(!chats) return;
        return sortingMessages(chats,userId);
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


function sortingMessages(chats,userId){
    let sortMessages = [];
    for(let x=0;x<chats.length;x++){
        chats[x].messages.forEach(message => {
            if(message.modelId !== null)
            {
                let chatInfo = {};
                chatInfo.id= chats[x]._id
                if(chats[x].isPrivate) {
                    chatInfo.title = chats[x].title;
                    if(chats[x].photo) message.photo = 'conversations/'+ chats[x].photo;
                }
                else{
                    if(String(chats[x].users[0]._id) !== String(userId)) {
                        chatInfo.title = chats[x].users[0].name;
                        if(chats[x].users[0].photo) chatInfo.photo = 'users/'+chats[x].users[0].photo;
                    }
                    else {
                        chatInfo.title = chats[x].users[1].name;
                        if(chats[x].users[1].photo) chatInfo.photo = 'users/'+chats[x].users[1].photo;
                    }
                }
                chatInfo.message = message;
                sortMessages.push(chatInfo);
            }
        });
    }
    sortMessages.sort((a,b)=>{
        a = a.message.createdDate;
        b = b.message.createdDate;
        return new Date(b) - new Date(a);
    })
    return sortMessages;
}