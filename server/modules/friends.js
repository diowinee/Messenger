const User = require('../schemas/User');

module.exports.outputFriends = async (id)=>{
    try{
        const user = await User.findOne({'_id':id}).populate('friends','_id login name photo');
        if(!user.friends) return;
        return user.friends;
    }
    catch(e){
        return;
    }
}
module.exports.outputRequests = async (id)=>{
    try{
        const user = await User.findOne({'_id':id}).populate('requests','_id login name photo');
        if(!user.requests) return;
        return user.requests;
    }
    catch(e){
        return;
    }
}

module.exports.searchFriends = async (searchText,id)=>{
    try{
        const user = await User.findOne({'_id':id}).populate('friends','_id');
        //?
        const friends = await User.find({$and:[
            {$or:[
                {'name':{$regex:`^${searchText}`,$options:'i'}},
                {'login':{$regex:`^${searchText}`,$options:'i'}}
            ]},
            {'_id':{$ne:id}},
            {'_id':{$in:user.friends}}
        ]})
        if(!friends) return;
        return friends;
    } 
    catch(e){
        return;
    }
}

module.exports.searchRequests = async (searchText,id)=>{
    try{
        const user = await User.findOne({'_id':id}).populate('requests','_id');
        //?
        const requests = await User.find({$and:[
            {$or:[
                {'name':{$regex:`^${searchText}`,$options:'i'}},
                {'login':{$regex:`^${searchText}`,$options:'i'}}
            ]},
            {'_id':{$ne:id}},
            {'_id':{$in:user.requests}}
        ]})
        if(!requests) return;
        return requests;
    } 
    catch(e){
        return;
    }
}

module.exports.addNewFriend = async (friendId,id)=>{
    try{
        const result = await User.updateOne({'_id':id},{$push:{friends:friendId}});
        const result2 = await User.updateOne({'_id':friendId},{$push:{friends:id}});
        const result3 = await User.updateOne({'_id':id},{$pull:{requests:friendId}});
        if(!(result||result2||result3)) return;
        return true;
    }
    catch (e){
        return;
    }
}

module.exports.addNewRequest = async (friendId,id)=>{
    try{
        const result = await User.updateOne({'_id':friendId},{$push:{requests:id}});
        if(!result) return;
        return result;
    }
    catch (e){
        return;
    }
}

module.exports.deleteFriend = async (friendId,id)=>{
    try{
        const result = await User.updateOne({'_id':id},{$pull:{friends:friendId}});
        const result2 = await User.updateOne({'_id':friendId},{$pull:{friends:id}});
        if(!result||!result2) return;
        return true;
    }
    catch (e){
        return;
    }
}

module.exports.deleteRequest= async (friendId,id)=>{
    try{
        const result = await User.updateOne({'_id':id},{$pull:{requests:friendId}});
        if(!result) return;
        return result;
    }
    catch (e){
        return;
    }
}