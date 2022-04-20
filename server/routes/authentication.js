const jwt = require('jsonwebtoken');
const auth = require('../modules/authentication');

module.exports.login = async (req,res) => {
    await auth.loginUser(req.body).then(user=>{
        if(!user) return res.sendStatus(403);
        createToken(user,res);
    })
};

module.exports.registration = async (req,res) => {
    if(!req.body.login || !req.body.name || !req.body.password) return res.sendStatus(400);
    try{
        await auth.createUser(req.body).then(user=>{
            if(!user) return res.sendStatus(403);
            createToken(user,res);
        })
    }
    catch{
        return res.sendStatus(500);
    }
}

function createToken(user,res){
    jwt.sign({
        id:user._id
    },'key',{expiresIn: '1h'},(err,token)=>{
        if(err) return res.sendStatus(500);
        res.cookie('token',token);
        res.json({
            token,
            redirectUrl:'main-menu'
        });
    });
}