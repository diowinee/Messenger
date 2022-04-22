const User = require('../schemas/User');

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
module.exports.editUser = async (id,name,pas) => {
    try{
        const user = await User.findByIdAndUpdate({_id:id},{name:name,password:pas});
        if(!user) return;
        return user;
    }
    catch(e){
        return;
    }
};