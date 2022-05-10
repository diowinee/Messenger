const User = require('../schemas/User');

module.exports.createUser = async({login,name,password}) => {
    try{
        const created = await isUserCreated(login);
        if(created) return;
        const user = new User({
            login:login,
            name:name,
            password:password
        });
        //?
        await user.save();
        return user;
    }
    catch(e){
        return;
    }
};

module.exports.loginUser = async({login,password}) => {
    try{
        const user=await User.findOne({login:login});
        if(!user) return;
        if(user.password!==password) return;
        return user;
    }
    catch(e){
        return;
    }
};

async function isUserCreated(login){
    try{
        const data = await User.findOne({'login':login});
        if(data) return true;
        return false;
    }
    catch(e){
        return false;
    }
}