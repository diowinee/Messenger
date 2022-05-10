const jwt = require('jsonwebtoken');
const userService = require('../modules/user');

module.exports.info = async (req,res) => {
    try {
        const user = await userService.infoUser(req.userId);
        if(!user) return res.sendStatus(403);
        res.json(user);
    }
    catch(e){
        res.sendStatus(403);
    }
};

module.exports.modification = async (req,res) => {
    try{
        const user = await userService.editUser(req.userId,req.body.newName,req.body.newPas,req.body.oldPas)
        if(!user) return res.sendStatus(403);
        res.send();
    }
    catch(e){
        res.sendStatus(403);
    }
};

module.exports.searchUsers = async (req,res)=>{
    try{
        const users = await userService.searchUsers(req.query.searchText,req.userId);
        if(!users) res.sendStatus(400);
        res.json(users);
    } catch(e){
        res.sendStatus(400);
    }
}