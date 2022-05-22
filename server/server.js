const express = require('express');
const bp = require("body-parser");
const cookieParser = require('cookie-parser');
const path = require('path');
const fileUpload = require('express-fileupload');

const db = require('./database');
const verify = require('./middlewares/verify');
const auth = require('./routes/authentication');
const user = require('./routes/user');
const friends = require('./routes/friends');
const chat = require('./routes/chat');
const chats = require('./routes/chats');
const { version } = require('os');

const app = express();
const port = 3000;

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/ui',express.static(path.join(__dirname,'../ui')));
app.use(fileUpload());
app.use('/img/users',express.static(path.join(__dirname,'/uploads/users')));
app.use('/img/conversations',express.static(path.join(__dirname,'/uploads/conversations')));

app.post('/login', auth.login);
app.post('/registration', auth.registration);
app.post('/modification',verify.verify,user.modification);
app.post('/modification/avatar',verify.verify,user.modificationAvatar);

app.post('/friends',verify.verify,friends.addNewFriend);
app.post('/friends/requests',verify.verify,friends.addNewRequest);
app.post('/chats',verify.verify,chats.createChat);
app.post('/chat/:chatId/text-message',verify.verify,chat.sendTextMessage);
app.post('/chat/:chatId/file-message',verify.verify,chat.sendFileMessage);
app.post('/chat/:chatId/participants',verify.verify,chat.addParticipant);
app.post('/chat/:chatId',verify.verify,chat.editChat);
app.post('/chat/:chatId/modification/avatar',verify.verify,chat.modificationAvatar);

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

app.get('/user/info',verify.verify,user.info);

app.get('/friends',verify.verify,friends.outputFriends);
app.get('/friends/requests',verify.verify,friends.outputRequests);

app.get('/chats',verify.verify,chats.getChats);
app.get('/chats/:chatId',verify.verify,chats.openChat);

app.get('/search-friends',verify.verify,friends.searchFriends);
app.get('/search-requests',verify.verify,friends.searchRequests);
app.get('/search-users',verify.verify,user.searchUsers);
app.get('/search-participants',verify.verify,chat.searchParticipants);

app.get('/chat/:chatId/search-friends',verify.verify,chat.searchFriends);
app.get('/chat/:chatId/message',verify.verify,chat.getMessage);
app.get('/chat/:chatId/friends',verify.verify,chat.outputFriends);
app.get('/chat/:chatId/participants',verify.verify,chat.getParticipants);
app.get('/chat/friends/:friendId',verify.verify,chat.openDialog);
app.get('/chat/notes',verify.verify,chat.openNotes);
app.get('/chat/:chatId',verify.verify,chat.getInfo);
app.get('/chat/download/:fileName',verify.verify,chat.downloadFile);

app.delete('/friends/:friendId',verify.verify,friends.deleteFriend);
app.delete('/friends/requests/:friendId',verify.verify,friends.deleteRequest);
app.delete('/chat/:chatId/participant',verify.verify,chat.deleteParticipant);
app.delete('/chat/:chatId',verify.verify,chat.logout)

app.listen(port,(err)=>{
    if(err) return console.log(err);
    console.log('The server is running on http://localhost:3000/');
});