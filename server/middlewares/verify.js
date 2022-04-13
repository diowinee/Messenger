const jwt = require('jsonwebtoken');

module.exports.verify = (req,res,next) => {
    const token = req.cookies.token;
    if(token == null) return res.status(401).redirect('/');
    jwt.verify(token,'key',{},(err)=>{
        if(err) return res.status(403).redirect('/');
        next();
    });
}