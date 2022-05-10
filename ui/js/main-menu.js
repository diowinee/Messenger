let menuVisibility = false;
let menuVisibilityRight = false;
let selectedSidebar;

let selectedChat;
let selectedChatName;
let creater;

const search = document.getElementById('search');
const searchBF = document.getElementById('search-bf');
const searchFF = document.getElementById('search-ff');
const searchBP = document.getElementById('search-bp');
const searchFD = document.getElementById('search-fd');
const menu = document.getElementById('button-menu');
const chats = document.getElementById('chats');
const friends = document.getElementById('friends');
const searchFriends = document.getElementById('container-search-friends');
const buttonArrowFriends = document.getElementById('button-arrow-friends');
const buttonArrow = document.getElementById('button-arrow');
const buttonArrowParticipants = document.getElementById('button-arrow-participants');
const userSiderbar = document.getElementById('user');
const createConversation = document.getElementById('create-conversation');
const addUsersSidebar = document.getElementById('add-users-sidebar');
const participantsConversation = document.getElementById('participants-conversation');
const conversationSettings = document.getElementById('conversation-settings');

document.getElementById('add-users').addEventListener('click',async ()=>{
    selectedSidebar='add-users-sidebar';
    searchFD.value='';
    searchBP.style.display='none';
    searchFD.style.display='inline';
    buttonArrow.style.display='none';
    buttonArrowParticipants.style.display='block';
    const participantsConversation = document.getElementById('participants-conversation');
    participantsConversation.style.display = 'none';
    const addUsersSidebar = document.getElementById('add-users-sidebar');
    addUsersSidebar.style.display = 'block';

    let res = await fetch(`/chat/${selectedChat}/friends`,{method:'GET'});
    if(res.ok){
        let friends = await res.json();
        fillingFriends('location-add-users',friends,true)
    }
});

document.getElementById('cm-logout').addEventListener('click',async ()=>{
    const res = await fetch(`/chat/${selectedChat}`,{method:'DELETE'});
    if(res.ok){
        const messageField = document.getElementById('message-field');
        messageField.innerHTML = '';
        const chatOnly1 = document.getElementById('chat-only-1');
        chatOnly1.style.display='none';
        const chatOnly2 = document.getElementById('chat-only-2');
        chatOnly2.style.display='none';
        const chatOnly3 = document.getElementById('chat-only-3');
        chatOnly3.style.display='none';
        search.style.display='inline';
        searchBF.style.display='none';
        searchFF.style.display='none';
        searchFD.style.display='none';
        searchBP.style.display='none';
        friends.style.display='none'; 
        searchFriends.style.display='none'; 
        buttonArrowFriends.style.display='none';
        buttonArrow.style.display='none';
        buttonArrowParticipants.style.display='none';
        userSiderbar.style.display='none'; 
        addUsersSidebar.style.display='none'; 
        createConversation.style.display='none'; 
        conversationSettings.style.display='none'; 
        menu.style.display='block';
        chats.style.display='block';
        getChats(); 
    }
})

document.getElementById('button-arrow-participants').addEventListener('click',async ()=>{
    selectedSidebar='participants-conversation';
    searchBP.value='';
    searchBP.style.display='inline';
    searchFD.style.display='none';
    buttonArrow.style.display='block';
    buttonArrowParticipants.style.display='none';
    const participantsConversation = document.getElementById('participants-conversation');
    participantsConversation.style.display = 'block';
    const addUsersSidebar = document.getElementById('add-users-sidebar');
    addUsersSidebar.style.display = 'none';
    searchParticipants();
});

document.getElementById('search-bp').addEventListener('input',async ()=>{
    searchParticipants();
});

document.getElementById('search-fd').addEventListener('input',async ()=>{
    let res = await fetch(`/chat/${selectedChat}/search-friends?searchText=${searchFD.value}`,{method:'GET'});
    if(res.ok){
        let friends = await res.json();
        fillingFriends('location-add-users',friends,true)
    }
});

document.getElementById('button-menu').addEventListener('click',switchVisibility);

document.getElementById('cm-participants').addEventListener('click',async ()=>{
    searchBP.value='';
    search.style.display='none';
    searchBF.style.display='none';
    searchFF.style.display='none';
    searchFD.style.display='none';
    searchBP.style.display='inline';
    menu.style.display='none';
    chats.style.display='none'; 
    friends.style.display='none'; 
    searchFriends.style.display='none'; 
    buttonArrowFriends.style.display='none';
    buttonArrow.style.display='none';
    buttonArrowParticipants.style.display='none';
    userSiderbar.style.display='none'; 
    addUsersSidebar.style.display='none'; 
    createConversation.style.display='none'; 
    conversationSettings.style.display='none'; 
    turnOffVisibility();
    turnOffVisibilityRight();
    switchSidebar('participants-conversation');  
    const res = await fetch(`/chat/${selectedChat}/participants`,{method:'GET'})
    if(res.ok){
        let result = await res.json();
        const participantsHTML = document.getElementById('location-of-participants');
        participantsHTML.innerHTML='';
        creater=result.participants.creater;
        for(let x=0;x<result.participants.users.length;x++){
            let button='';
            if(result.participants.users[x]._id!==result.userId&&creater===result.userId){
                button=
                `<button class="but-cross" onclick="deleteParticipant(this,event)">
                    <i class="icon-cross"></i> 
                </button>`
            }
            participantsHTML.innerHTML +=
            `<div class="friend" onclick="openDialog(this,'${result.participants.users[x].name}')" name="${result.participants.users[x]._id}">
                <img src="../ui/img/0.jpg" alt="" class="avatar">
                <div class="text-block">
                    <div>
                        <p class="name">${result.participants.users[x].name}</p><br>
                        <p class="message">${result.participants.users[x].login}</p> 
                    </div>  
                </div>
                ${button}
            </div>`;
        }
    }
});

document.getElementById('conversation-settings-send').addEventListener('click', async ()=>{
    const conversationSettingsInput = document.getElementById('conversation-settings-input');
    const res = await fetch(`/chat/${selectedChat}`,{method:'POST', headers:{"Content-Type":"application/json"},body:JSON.stringify({title:conversationSettingsInput.value})});
    if(res.ok){
        alert('Данные успешно сохранены');
        const conversationName = document.getElementById('conversation-name');
        conversationName.textContent=conversationSettingsInput.value;
    }
})

document.getElementById('cm-settings').addEventListener('click',async ()=>{
    search.style.display='none';
    searchBF.style.display='none';
    searchFF.style.display='none';
    searchFD.style.display='none';
    searchBP.style.display='none';
    menu.style.display='none';
    chats.style.display='none'; 
    friends.style.display='none'; 
    searchFriends.style.display='none'; 
    buttonArrowFriends.style.display='none';
    buttonArrow.style.display='none';
    buttonArrowParticipants.style.display='none';
    userSiderbar.style.display='none'; 
    addUsersSidebar.style.display='none'; 
    createConversation.style.display='none'; 
    participantsConversation.style.display='none'; 
    turnOffVisibility();
    turnOffVisibilityRight();
    switchSidebar('conversation-settings');  
    const res = await fetch(`/chat/${selectedChat}`,{method:'GET'})
    if(res.ok){
        const result = await res.json();

        const conversationSettingsInput = document.getElementById('conversation-settings-input');
        const conversationSettingsP = document.getElementById('conversation-settings-p');
        const conversationSettingsSend = document.getElementById('conversation-settings-send');
        
        if(result.info.creater===result.userId){
            conversationSettingsInput.style.display='block';
            conversationSettingsP.style.display='none';
            conversationSettingsSend.style.display='block';
            conversationSettingsInput.value = result.info.title
        }
        else{
            conversationSettingsInput.style.display='none';
            conversationSettingsP.style.display='block';
            conversationSettingsSend.style.display='none';
            conversationSettingsP.textContent = result.info.title
        }
    }
})

document.getElementById('button-menu-right').addEventListener('click',()=>{
    switchVisibilityRight();
})

document.getElementById('conversation-send').addEventListener('click',async ()=>{
    const conversationInput = document.getElementById('conversation-input');
    const res = await fetch('/chats',{method:'POST',headers:{"Content-Type":"application/json"},body:JSON.stringify({title:conversationInput.value})});
    if(res.ok){
        alert('Беседа создана');
    }
})

document.getElementById('hm-friends').addEventListener('click',async ()=>{
    searchBF.value='';
    search.style.display='none';
    searchBF.style.display='inline';
    switchSidebar('friends');
    switchVisibility();
    showFriends();
})

document.getElementById('search-ff').addEventListener('input',async (e)=>{
    searchUsersDB();
})

document.getElementById('search-bf').addEventListener('input',async (e)=>{
    let res = await fetch(`/search-friends?searchText=${searchBF.value}`,{method:'GET'});
    if(res.ok){
        let friends = await res.json();
        fillingFriends('location-of-friends',friends,false)
    }
})

document.getElementById('hm-account').addEventListener('click',async ()=>{
    search.style.display='none';
    switchSidebar('user');
    switchVisibility();
    const res = await fetch('/user/info',{method:'GET'});
    if(res.ok){
        const info = await res.json();
        const userLoginText = document.getElementById('user-login-text')
        userLoginText.textContent = info.login;
        const userNewName = document.getElementById('user-new-name')
        userNewName.value =info.name
    }
})

document.getElementById('hm-create-conversation').addEventListener('click',()=>{
    search.style.display='none';
    switchSidebar('create-conversation');
    switchVisibility();
})

document.getElementById('button-arrow').addEventListener('click',()=>{
    menu.style.display='inline';
    buttonArrow.style.display='none';
    chats.style.display = 'block';
    const sidebar = document.getElementById(selectedSidebar);
    sidebar.style.display = 'none';
    search.value='';
    search.style.display='inline';
    searchBF.style.display='none';
    searchBP.style.display='none';
    getChats();
})

document.getElementById('friends-search').addEventListener('click',()=>{
    friends.style.display = 'none';
    searchFriends.style.display = 'block';
    buttonArrowFriends.style.display = 'inline';
    buttonArrow.style.display = 'none';
    searchBF.style.display='none';
    searchFF.value='';
    searchFF.style.display='inline';
    searchUsersDB();
})

document.getElementById('button-arrow-friends').addEventListener('click',()=>{
    friends.style.display = 'block';
    searchFriends.style.display = 'none';
    searchFF.style.display='none';
    searchBF.value='';
    searchBF.style.display='inline';
    buttonArrowFriends.style.display = 'none';
    buttonArrow.style.display = 'block';
    showFriends();
})

document.getElementById('write-message-send').addEventListener('click',async ()=>{
    const writeMessage = document.getElementById('write-message');
    const res = await fetch(`/chat/${selectedChat}/message`,{method:'POST',headers:{"Content-Type":"application/json"},body:JSON.stringify({type:'TextMessage', message: writeMessage.value})});
    writeMessage.value='';
    if(res.ok){
        const res2 = await fetch(`/chat/${selectedChat}/message`,{method:'GET'});
        if(res2.ok){
            const result = await res2.json();
            displayСhat(result);
            getChats();
        }
    }
});

document.getElementById('new-user-send').addEventListener('click',async()=>{
    const userNewName = document.getElementById('user-new-name');
    const userOldPassword = document.getElementById('user-old-password')
    const userNewPassword = document.getElementById('user-new-password')
    let newData = {
        newName:`${userNewName.value}`,
        newPas:`${userNewPassword.value}`,
        oldPas:`${userOldPassword.value}`
    };
    const res = await fetch('/modification',{method:'POST',headers:{"Content-Type":"application/json"}, body:JSON.stringify(newData)});
    if(res.ok){
        userOldPassword.value='';
        userNewPassword.value='';
        alert('Данные успешно сохранены');
    }
})

function switchSidebar(e){
    selectedSidebar=e;
    menu.style.display='none';
    buttonArrow.style.display='inline';
    const elem = document.getElementById(e);
    chats.style.display = 'none';
    elem.style.display = 'block';
}

function switchVisibility(){
    const headerMenu = document.getElementById('header-menu');
    if(menuVisibility){
        menuVisibility=false;
        headerMenu.style.display = 'none'; 
    }
    else{
        menuVisibility=true;
        headerMenu.style.display = 'block';
    }
}

function switchVisibilityRight(){
    const headerMenu = document.getElementById('chat-menu');
    if(menuVisibilityRight){
        menuVisibilityRight=false;
        headerMenu.style.display = 'none'; 
    }
    else{
        menuVisibilityRight=true;
        headerMenu.style.display = 'block';
    }
}

function turnOffVisibility(){
    const headerMenu = document.getElementById('header-menu');
    menuVisibility=false;
    headerMenu.style.display = 'none'; 
}

function turnOffVisibilityRight(){
    const headerMenu = document.getElementById('chat-menu');
    menuVisibilityRight=false;
    headerMenu.style.display = 'none'; 
}

async function searchUsersDB(){
    const inputSearch = document.getElementById('search-ff');
    let res = await fetch(`/search-users?searchText=${inputSearch.value}`,{method:'GET'});
    if(res.ok){
        let users = await res.json();
        const usersHTML = document.getElementById('search-friends');
        if(users.length===0){
            usersHTML.innerHTML = '<p class="friends-info">Пользователи с таким именем или логином не найдены</p>';
        }
        else{
            usersHTML.innerHTML='';
            for(let x=0;x<users.length;x++){
                usersHTML.innerHTML +=
                `<div class="a-user">
                    <img src="../ui/img/0.jpg" alt="" class="avatar">
                    <div class="text-block">
                        <div>
                            <p class="name">${users[x].name}</p><br>
                            <p class="message">${users[x].login}</p> 
                        </div>  
                    </div>
                    <button class="but-cross" name="${users[x]._id}" onclick="addNewFriend(this)">
                        <i class="icon-plus"></i> 
                    </button>
                </div>`;
            }
        }
    }
    else{
        usersHTML.innerHTML = '<p class="friends-info">Пользователи с таким именем или логином не найдены</p>';
    }
}

async function addNewFriend(friend){
    let res = await fetch('/friends',{method:'POST',headers:{"Content-Type":"application/json"},body:JSON.stringify({friendId:`${friend.name}`})})
    if(res.ok){
        searchUsersDB();
    }
}

async function deleteFriend(friend,event){
    event.stopPropagation();
    let res = await fetch(`/friends/${friend.parentNode.attributes["name"].value}`,{method:'DELETE'})
    if(res.ok){
        showFriends();
    }
}

async function addParticipant(friend,event){
    event.stopPropagation();
    let res = await fetch(`/chat/${selectedChat}/participants`,{method:'POST', headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:friend.parentNode.attributes["name"].value})});
    if(res.ok){
        let res2 = await fetch(`/chat/${selectedChat}/friends`,{method:'GET'});
        if(res2.ok){
            let friends = await res2.json();
            fillingFriends('location-add-users',friends,true)
        }
    }

}
async function deleteParticipant(friend,event){
    event.stopPropagation();
    let res = await fetch(`/chat/${selectedChat}/participant`,{method:'DELETE', headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:friend.parentNode.attributes["name"].value})});
    if(res.ok){
        searchParticipants();
    }
}

async function showFriends(){
    let res = await fetch("/friends",{method:"GET"});
    if (res.ok) {
        let friends = await res.json();
        const friendsHTML = document.getElementById('location-of-friends');
        if(friends.length===0){
            friendsHTML.innerHTML = '<p class="friends-info">Здесь будет отображаться список ваших друзей</p>';
        }
        else{
            friendsHTML.innerHTML = '';
            for(let x=0;x<friends.length;x++){
                friendsHTML.innerHTML += 
                `<div class="friend" onclick="openDialog(this,'${friends[x].name}')" name="${friends[x]._id}">
                    <img src="../ui/img/0.jpg" alt="" class="avatar">
                    <div class="text-block">
                        <div>
                            <p class="name">${friends[x].name}</p><br>
                            <p class="message">${friends[x].login}</p> 
                        </div>  
                    </div>
                    <button class="but-cross" onclick="deleteFriend(this,event)">
                        <i class="icon-cross"></i> 
                    </button>
                </div>`;
            }
        }
    } 
    else{
        friendsHTML.innerHTML = '<p class="friends-info">Здесь будет отображаться список ваших друзей</p>';
    }
}

async function openDialog(id,name){
    let res = await fetch(`/chat/friends/${id.attributes["name"].value}`,{method:'GET'});
    if(res.ok){
        let result = await res.json();
        selectedChat = result.chat._id;
        selectedChatName = name;
        displayСhat(result);
    }
}

function displayСhat(result){
    turnOffVisibilityRight();
    let messageField = document.getElementById('message-field');
    messageField.innerHTML = '';
    const chatOnly1 = document.getElementById('chat-only-1');
    chatOnly1.style.display='flex';
    const chatOnly2 = document.getElementById('chat-only-2');
    if(result.chat.isPrivate) chatOnly2.style.display='flex';
    else chatOnly2.style.display='none';
    const chatOnly3 = document.getElementById('chat-only-3');
    chatOnly3.style.display='flex';
    const writeMessage = document.getElementById('write-message');
    writeMessage.value='';
    const conversationName = document.getElementById('conversation-name');
    conversationName.textContent=selectedChatName;
    if(result.chat.messages.length===0){
        messageField.innerHTML = '<p class="chat-info">Сообщений пока нету</p>';
    }
    for(let x=0;x<result.chat.messages.length;x++){
        if(result.mainUserId===result.chat.messages[x].user._id){
            messageField.innerHTML += `
            <div class="my-message">
                <div class="chat-message">
                    <p class="chat-text">${result.chat.messages[x].modelId.text}</p>
                </div>
            </div>`
        }
        else{
            messageField.innerHTML += `
            <div class="interlocutor">
                <img src="../ui/img/0.jpg" class="chat-avatar" alt="">
                <div class="chat-message">
                    <p class="chat-name">${result.chat.messages[x].user.name}</p>
                    <p class="chat-text">${result.chat.messages[x].modelId.text}</p>
                </div>
            </div>`;
        }
    }
    const messageContainer = document.getElementById('message-container');
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

async function getChats(){
    const res = await fetch('/chats',{method:'GET'});
    if(res.ok){
        const result = await res.json();
        const containerChats = document.getElementById('container-chats');
        containerChats.innerHTML='';
        let name,date,message;
        for(let x=0;x<result.chats.length;x++){
            if(result.chats[x].isPrivate) name=result.chats[x].title;
            else{
                if(result.chats[x].users[0]._id!==result.userId) name=result.chats[x].users[0].name
                else name=result.chats[x].users[1].name
            }
            if(result.chats[x].messages.length===0){
                message='Беседа создана'
            }
            else if(result.chats[x].messages[result.chats[x].messages.length-1].models==='TextMessage'){
                message=result.chats[x].messages[result.chats[x].messages.length-1].modelId.text;
            }
            else{
                message='Файл';
            }
            date='17:03'
            containerChats.innerHTML += 
                `<div class="chat" onclick="openChat(this,'${name}')" name="${result.chats[x]._id}">
                    <img src="../ui/img/0.jpg" alt="" class="avatar">
                    <div class="text-block">
                        <div class="ctb-div">
                            <p class="name ellipsis">${name}</p>
                            <p class="time">${date}</p>
                        </div>  
                        <div class="ctb-div">
                            <p class="message ellipsis">${message}</p> 
                            <img src="../ui/img/ellipse.svg" alt="" class="viewed">
                        </div>
                    </div>
                </div>`;
        }
    }
}

async function openChat(id,name){
    let res = await fetch(`/chats/${id.attributes["name"].value}`,{method:'GET'});
    if(res.ok){
        let result = await res.json();
        selectedChat = result.chat._id;
        selectedChatName = name;
        displayСhat(result);
    }
}

async function searchParticipants(){
    let res = await fetch(`/search-participants?searchText=${searchBP.value}&chatId=${selectedChat}`,{method:'GET'});
    if(res.ok){
        let result = await res.json();
        const participantsHTML = document.getElementById('location-of-participants');
        participantsHTML.innerHTML='';
        for(let x=0;x<result.participants.length;x++){
            let button='';
            if(result.participants[x]._id!==result.userId&&creater===result.userId){
                button=
                `<button class="but-cross" onclick="deleteParticipant(this,event)">
                    <i class="icon-cross"></i> 
                </button>`
            }
            participantsHTML.innerHTML +=
            `<div class="friend" onclick="openDialog(this,'${result.participants[x].name}')" name="${result.participants[x]._id}">
                <img src="../ui/img/0.jpg" alt="" class="avatar">
                <div class="text-block">
                    <div>
                        <p class="name">${result.participants[x].name}</p><br>
                        <p class="message">${result.participants[x].login}</p> 
                    </div>  
                </div>
                ${button}
            </div>`;
        }
    }
}

function fillingFriends(location,friends,buttonValue){
    const friendsHTML = document.getElementById(location);
    if(friends.length===0){
        friendsHTML.innerHTML = '<p class="friends-info">Друзей с таким именем или логином не найдены</p>';
    }
    else{
        friendsHTML.innerHTML='';
        let button;
        if(buttonValue){
            button = 
            `<button class="but-plus" onclick="addParticipant(this,event)">
                <i class="icon-plus"></i> 
            </button>`;
        }
        else{
            button = 
            `<button class="but-cross" onclick="deleteFriend(this,event)">
                <i class="icon-cross"></i> 
            </button>`;
        }
        for(let x=0;x<friends.length;x++){
            friendsHTML.innerHTML +=
            `<div class="friend" onclick="openDialog(this,'${friends[x].name}')" name="${friends[x]._id}">
                <img src="../ui/img/0.jpg" alt="" class="avatar">
                <div class="text-block">
                    <div>
                        <p class="name">${friends[x].name}</p><br>
                        <p class="message">${friends[x].login}</p> 
                    </div>  
                </div>
                ${button}
            </div>`;
        }
    }
}

getChats();