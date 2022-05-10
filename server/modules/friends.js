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

module.exports.addNewFriend = async (friendId,id)=>{
    try{
        const result = await User.updateOne({'_id':id},{$push:{friends:friendId}});
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
        if(!result) return;
        return result;
    }
    catch (e){
        return;
    }
}