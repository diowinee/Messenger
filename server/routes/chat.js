const { json } = require('express/lib/response');
const chatService = require('../modules/chat');
const path = require('path');

module.exports.openDialog = async(req,res)=>{
    try{
        const chat = await chatService.openDialog(req.userId,req.params.friendId)
        if(!chat) res.sendStatus(400);
        res.json({mainUserId:req.userId,chat});
    }catch(e){
        res.sendStatus(400);
    }
}
module.exports.openNotes = async(req,res)=>{
    try{
        const chat = await chatService.openNotes(req.userId)
        if(!chat) res.sendStatus(400);
        res.json({mainUserId:req.userId,chat});
    }catch(e){
        res.sendStatus(400);
    }
}

module.exports.sendTextMessage = async(req,res)=>{
    try{
        const result = await chatService.sendTextMessage(req.params.chatId,req.body.message,req.userId);
        if(!result) res.sendStatus(400);
        res.send();
    }catch(e){
        res.sendStatus(400);
    }
}
module.exports.sendFileMessage = async(req,res)=>{
    try{
        const result = await chatService.sendFileMessage(req.params.chatId,req.files.file,req.userId);
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
        res.json(result);
    } catch(e){
        res.sendStatus(400);
    }
}
module.exports.logout = async (req,res)=>{
    try{
        const result = await chatService.logout(req.params.chatId,req.userId);
        if(!result) res.sendStatus(400);
        res.send();
    } catch(e){
        res.sendStatus(400);
    }
}
module.exports.downloadFile = (req,res)=>{
    res.download(path.join(__dirname,`..\\uploads\\files\\${req.params.fileName}`),(err)=>{
        if(err) res.sendStatus(400)
    });
}
module.exports.modificationAvatar = async (req,res) => {
    try{
        const avatar = await chatService.editAvatar(req.params.chatId,req.files.file);
        if(!avatar) res.sendStatus(403);
        res.json({avatar});
    }
    catch(e){
        res.sendStatus(403);
    }
};