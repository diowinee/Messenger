const { json } = require('express/lib/response');
const chatsService = require('../modules/chats');

module.exports.openDialog = async(req,res)=>{
    try{
        const chat = await chatsService.openDialog(req.userId,req.params.friendId);    
        if(!chat) res.sendStatus(400);
        res.json({mainUserId:req.userId,chat});
    }catch(e){
        res.sendStatus(400);
    }
}

module.exports.sendMessage = async(req,res)=>{
    try{
        const result = await chatsService.sendMessage(req.params.chatId,req.body.type,req.body.message,req.userId);
        if(!result) res.sendStatus(400);
        res.send();
    }catch(e){
        res.sendStatus(400);
    }
}

module.exports.getMessage = async(req,res)=>{
    try{
        const chat = await chatsService.getMessage(req.params.chatId);
        if(!chat) res.sendStatus(400);
        res.json({mainUserId:req.userId,chat});
    }catch(e){
        res.sendStatus(400);
    }
}
