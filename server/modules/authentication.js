const jwt = require("jsonwebtoken");
let users = [{
    login:"login",
    name:"name",
    password:"password"
}]
module.exports.login = (req,res) => {
    let rUser;
    users.find((user)=>{
        if(user["login"]===req.body.login&&user["password"]===req.body.password) return rUser=user;
    })
    if(!rUser) return res.sendStatus(403);
    createToken(rUser,res)
};
module.exports.registration = (req,res) => {
    if(!req.body.login || !req.body.name || !req.body.password) return res.sendStatus(400);
    users.push({
        login: req.body.login,
        name: req.body.name,
        password: req.body.password
    });
    createToken(users[users.length-1],res)
}
function createToken(user,res){
    jwt.sign({
        sub:user.login
    },'key',{expiresIn: "1h"},(err,token)=>{
        if(err) return res.sendStatus(500);
        res.cookie('token',token);
        res.json({
            token,
            redirectUrl:'main-menu'
        });
    });
}