const jwt = require('jsonwebtoken');
const userm = require('../modules/user');

module.exports.info = async (req,res) => {
    const token = req.cookies.token;
    jwt.verify(token,'key',{},async (err,data)=>{
        if(err) return res.status(403).redirect('/');
        await userm.infoUser(data.id).then(user=>{
            if(!user) return res.status(403).redirect('/');
            res.send(user);
        })
    });
}

module.exports.modification = async(req,res) => {
    const token = req.cookies.token;
    jwt.verify(token,'key',{},async (err,data)=>{
        if(err) return res.sendStatus(403);
        await userm.editUser(data.id,req.body.newName,req.body.newPas).then(user=>{
            if(!user) return res.sendStatus(403);
            res.json(user);
        })
    });
}