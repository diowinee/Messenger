const jwt = require('jsonwebtoken');
const userService = require('../modules/user');

module.exports.info = async (req,res) => {
    try {
        const user = await userService.infoUser(req.userId);
        if(!user) return res.status(403).redirect('/');
        res.send(user);
    }
    catch(e){
        res.status(403).redirect('/');
    }
};

module.exports.modification = async (req,res) => {
    try{
        const user = await userService.editUser(req.userId,req.body.newName,req.body.newPas)
        if(!user) return res.sendStatus(403);
        res.json(user);
    }
    catch(e){
        res.sendStatus(403);
    }
};