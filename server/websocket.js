const {Server} = require('socket.io');
const db = require('./database');
const jwt = require('jsonwebtoken');
const User = require('./schemas/User');
const Chat = require('./schemas/Chat');

const io = new Server(8000);
const users = {};
const usersIds = [];

io.on('connection', (socket)=>{
    let currentUser = null;
    
    socket.on('login', async (data)=>{
        users[socket.id] = data.token;
        try{
            const user = await jwt.verify(data.token,'key');
            currentUser = await User.findOne({_id:user.id})
            usersIds.push(user.id);
        }
        catch(e){
            console.log(e.message);
        }
    });

    socket.on('join chats',(data)=>{
        for(let x=0;x<data.chats.length;x++){
            socket.join(data.chats[x]._id); 
        }
    });

    socket.on('dialogues online',async ()=>{
        try{
            const dialogues = await Chat.find({$and:[
                {'isPrivate':false},
                {'users':{$in:[currentUser._id]}},
                {$where: "this.users.length == 2"}
            ]},'_id users');
            dialogues.forEach(dialog => { 
                let index;
                if(String(dialog.users[1]._id)===String(currentUser._id)){
                    index = usersIds.indexOf(String(dialog.users[0]._id))
                }
                else{
                    index = usersIds.indexOf(String(dialog.users[1]._id))
                }
                if (index !== -1) {
                    socket.emit('online',{dialog:dialog._id});
                }
                socket.broadcast.to(String(dialog._id)).emit('online',{dialog:dialog._id});
            });
        }
        catch(e){
            console.log(e.message);
        }
    });

    socket.on('send message',(data)=>{
        io.to(data.chatId).emit('accept message',{chatId:data.chatId});
    });

    socket.on('disconnect', async ()=>{
        try{
            delete users[socket.id];
            const index = usersIds.indexOf(String(currentUser._id));
            if (index !== -1) {
                usersIds.splice(index, 1);
            }
            const dialogues = await Chat.find({$and:[
                {'isPrivate':false},
                {'users':{$in:[currentUser._id]}},
                {$where: "this.users.length == 2"}
            ]},'_id');
            dialogues.forEach(dialog => {
                socket.broadcast.to(String(dialog._id)).emit('offline',{dialog:dialog._id});
            });
        }
        catch(e){
            console.log(e.message);
        }
    });
});