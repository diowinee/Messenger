const jwt = require('jsonwebtoken');
const authService = require('../modules/authentication');

module.exports.login = async (req,res) => {
    try{
        const user = await authService.loginUser(req.body);
        if(!user) return res.sendStatus(403);
        createToken(user,res);
    }
    catch(e){
        res.sendStatus(403);
    }
};

module.exports.registration = async (req,res) => {
    try{
        if(!req.body.login || !req.body.name || !req.body.password) return res.sendStatus(400);
        const user = await authService.createUser(req.body);
        if(!user) return res.sendStatus(403);
        createToken(user,res);
    }
    catch(e){
        res.sendStatus(403);
    }
};

function createToken(user,res){
    try{
        const token = jwt.sign({
            id:user._id
        },'key');
        res.cookie('token',token);
        res.json({
            token,
            redirectUrl:'main-menu'
        });
    }
    catch(e){
        res.sendStatus(500);
    }
}