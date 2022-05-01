const express = require('express');
const bp = require("body-parser");
const cookieParser = require('cookie-parser');
const path = require('path');

const db = require('./database');
const verify = require('./middlewares/verify');
const auth = require('./routes/authentication');
const user = require('./routes/user');
const friends = require('./routes/friends');
const { version } = require('os');

const app = express();
const port = 3000;

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/ui',express.static(path.join(__dirname,'../ui')));

app.post('/login', auth.login);
app.post('/registration', auth.registration);
app.post('/modification',verify.verify,user.modification);
app.post('/friends',verify.verify,friends.addNewFriend)

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"../public/index.html"),(err)=>{
        if(err) res.sendStatus(500);
    });
});
app.get('/main-menu',verify.verify,(req,res)=>{
    res.sendFile(path.join(__dirname,"../public/main-menu.html"),(err)=>{
        if(err) res.sendStatus(500);
    })
});
app.get('/info',verify.verify,user.info);
app.get('/friends',verify.verify,friends.outputFriends);
app.get('/search-friends',verify.verify,friends.searchFriends)

app.delete('/friends',verify.verify,friends.deleteFriend);

app.listen(port,(err)=>{
    if(err) return console.log(err);
    console.log('The server is running on http://localhost:3000/');
});