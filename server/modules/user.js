const User = require('../schemas/User');
const db = require('../database');

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports.infoUser = async (id) => {
    return await User.findOne({_id:id}).then((user)=>{
        return user;
    });
}
module.exports.editUser = async (id,name,pas) => {
    return await User.findByIdAndUpdate({_id:id},{name:name,password:pas}).then((user)=>{
        if(!user) return;
        return user;
    })
}