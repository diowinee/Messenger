const { json } = require('express/lib/response');
const chatService = require('../modules/chat');

module.exports.openDialog = async(req,res)=>{
    try{
        const chat = await chatService.openDialog(req.userId,req.params.friendId)
        if(!chat) res.sendStatus(400);
        res.json({mainUserId:req.userId,chat});
    }catch(e){
        res.sendStatus(400);
    }
}
module.exports.sendMessage = async(req,res)=>{
    try{
        const result = await chatService.sendMessage(req.params.chatId,req.body.type,req.body.message,req.userId);
        if(!result) res.sendStatus(400);
        res.send();
    }catch(e){
        res.sendStatus(400);
    }
}
module.exports.getMessage = async(req,res)=>{
    try{
        const chat = await chatService.getMessage(req.params.chatId);
        if(!chat) res.sendStatus(400);
        res.json({mainUserId:req.userId,chat});
    }catch(e){
        res.sendStatus(400);
    }
}
module.exports.getParticipants = async(req,res)=>{
    try{
        const participants = await chatService.getParticipants(req.params.chatId);
        if(!participants) res.sendStatus(400);
        res.json({participants,userId:req.userId});
    }
    catch(e){
        res.sendStatus(400);
    }
}
module.exports.getInfo = async(req,res)=>{
    try{
        const info = await chatService.getInfo(req.params.chatId);
        if(!info) res.sendStatus(400);
        res.json({info,userId:req.userId});
    }
    catch(e){
        res.sendStatus(400);
    }
}
module.exports.searchParticipants = async (req,res)=>{
    try{
        const participants = await chatService.searchParticipants(req.query.searchText,req.query.chatId);
        if(!participants) res.sendStatus(400);
        res.json({participants,userId:req.userId});
    }
    catch(e){
        res.sendStatus(400);
    }
}
module.exports.addParticipant = async (req,res)=>{
    try{
        const result = await chatService.addParticipant(req.params.chatId,req.body.userId);
        if(!result) res.sendStatus(400);
        res.send();
    }
    catch(e){
        res.sendStatus(400);
    }
}
module.exports.deleteParticipant = async (req,res)=>{
    try{
        const result = await chatService.deleteParticipant(req.params.chatId,req.body.userId);
        if(!result) res.sendStatus(400);
        res.send();
    }
    catch(e){
        res.sendStatus(400);
    }
}
module.exports.outputFriends = async (req,res)=>{
    try{
        const friends = await chatService.outputFriends(req.userId,req.params.chatId);
        if(!friends) res.sendStatus(400);
        res.json(friends);
    } catch(e){
        res.sendStatus(400);
    }
}
module.exports.searchFriends = async (req,res)=>{
    try{
        const friends = await chatService.searchFriends(req.query.searchText,req.userId,req.params.chatId);
        if(!friends) res.sendStatus(400);
        res.json(friends);
    } catch(e){
        res.sendStatus(400);
    }
}
module.exports.editChat = async (req,res)=>{
    try{
        const result = await chatService.editChat(req.params.chatId,req.body.title);
        if(!result) res.sendStatus(400);
        res.send();
    } catch(e){
        res.sendStatus(400);
    }
}
module.exports.logout = async (req,res)=>{
    try{
        const result = await chatService.logout(req.params.chatId,req.userId);
        if(!result) res.sendStatus(400);
        res.send();
    }catch(e){
        res.sendStatus(400);
    }
}