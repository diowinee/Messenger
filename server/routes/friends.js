const friendsService = require('../modules/friends');

module.exports.outputFriends = async (req,res)=>{
    try{
        const friends = await friendsService.outputFriends(req.userId);
        if(!friends) res.sendStatus(400);
        res.json(friends);
    } catch(e){
        res.sendStatus(400);
    }
}
module.exports.outputRequests = async (req,res)=>{
    try{
        const friends = await friendsService.outputRequests(req.userId);
        if(!friends) res.sendStatus(400);
        res.json(friends);
    } catch(e){
        res.sendStatus(400);
    }
}
module.exports.searchFriends = async (req,res)=>{
    try{
        const friends = await friendsService.searchFriends(req.query.searchText,req.userId);
        if(!friends) res.sendStatus(400);
        res.json(friends);
    } catch(e){
        res.sendStatus(400);
    }
}
module.exports.searchRequests = async (req,res)=>{
    try{
        const friends = await friendsService.searchRequests(req.query.searchText,req.userId);
        if(!friends) res.sendStatus(400);
        res.json(friends);
    } catch(e){
        res.sendStatus(400);
    }
}
module.exports.addNewFriend = async (req,res)=>{
    try{
        const result = await friendsService.addNewFriend(req.body.friendId,req.userId);
        if(!result) res.sendStatus(400);
        res.send();
    } catch (e) {
        res.sendStatus(400);
    }
}
module.exports.addNewRequest= async (req,res)=>{
    try{
        const result = await friendsService.addNewRequest(req.body.friendId,req.userId);
        if(!result) res.sendStatus(400);
        res.send();
    } catch (e) {
        res.sendStatus(400);
    }
}
module.exports.deleteFriend = async (req,res)=>{
    try{
        const result = await friendsService.deleteFriend(req.params.friendId,req.userId);
        if(!result) res.sendStatus(400);
        res.send();
    } catch (e) {
        res.sendStatus(400);
    }
}
module.exports.deleteRequest= async (req,res)=>{
    try{
        const result = await friendsService.deleteRequest(req.params.friendId,req.userId);
        if(!result) res.sendStatus(400);
        res.send();
    } catch (e) {
        res.sendStatus(400);
    }
}