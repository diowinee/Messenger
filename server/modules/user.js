const User = require('../schemas/User');
const path = require('path');

module.exports.infoUser = async (id) => {
    try{
        const user = await User.findOne({_id:id});
        if(!user) return;
        return user;
    }
    catch(e){
        return;
    }
};

module.exports.editUser = async (id,name,newPas,oldPas) => {
    try{
        let user;
        if(newPas&&oldPas){
            user = await User.findOneAndUpdate({$and:[
                {_id:id},
                {password:oldPas}
            ]},{'name':name,password:newPas});
        }
        else{
            user = await User.findOneAndUpdate({_id:id},{'name':name});
        }
        if(!user) return;
        return user;
    }
    catch(e){
        return;
    }
};
module.exports.editAvatar = async (id,file) => {
    try{
        const result = file.mv('./uploads/users/'+id+path.extname(file.name))
        if(!result) return;
        const avatar = await User.findOneAndUpdate({_id:id},{photo:String(id+path.extname(file.name))});
        if(!avatar) return;
        return avatar;
    }
    catch(e){
        return;
    }
};

module.exports.searchUsers = async (searchText,id)=>{
    try{
        const user = await User.findOne({'_id':id}).populate('friends','_id');
        //?
        const users = await User.find({$and:[
            {$or:[
                {'name':{$regex:`^${searchText}`,$options:'i'}},
                {'login':{$regex:`^${searchText}`,$options:'i'}}
            ]},
            {'_id':{$ne:id}},
            {'_id':{$nin:user.friends}},
            {'_id':{$nin:user.requests}},
            {'requests':{$nin:[id]}}
        ]})
        if(!users) return;
        return users;
    } 
    catch(e){
        return;
    }
}