const User = require('../schemas/User');
const db = require('../database');

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports.createUser = async ({login,name,password}) => {
    return await User.findOne({'login':login}).then(async (data)=>{
        if(data) throw new Error();
        const user = new User({
            login:login,
            name:name,
            password:password
        });
        await user.save((err) => {
            if(err) throw handleError(err);
        });
        return user;
    });
}
module.exports.loginUser = async ({login,password}) => {
    return await User.findOne({login:login}).then((user)=>{
        if(!user) return;
        if(user.password!==password) return;
        return user;
    });
}