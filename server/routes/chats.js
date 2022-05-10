const chatsService = require('../modules/chats');

module.exports.createChat = async (req,res)=>{
    try{
        const newChat = await chatsService.createChat(req.body.title,req.userId)
        if(!newChat) res.sendStatus(400);
        res.send();
    }
    catch(e){
        res.sendStatus(400);
    }
}
module.exports.getChats = async (req,res)=>{
    try{
        const chats = await chatsService.getChats(req.userId);
        if(!chats) res.sendStatus(400);
        res.json({chats,userId:req.userId});
    }
    catch(e){
        res.sendStatus(400);
    }

}
module.exports.openChat = async(req,res)=>{
    try{
        const chat = await chatsService.openChat(req.params.chatId);    
        if(!chat) res.sendStatus(400);
        res.json({mainUserId:req.userId,chat});
    }catch(e){
        res.sendStatus(400);
    }
}