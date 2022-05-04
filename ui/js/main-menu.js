let menuVisibility = false;
let selectedSidebar;
let selectedChat;
let selectedChatName;

const search = document.getElementById('search');
const searchBF = document.getElementById('search-bf');
const searchFF = document.getElementById('search-ff');
const menu = document.getElementById('button-menu');
const chats = document.getElementById('chats');
const friends = document.getElementById('friends');
const searchFriends = document.getElementById('search-friends');
const buttonArrowFriends = document.getElementById('button-arrow-friends');
const buttonArrow = document.getElementById('button-arrow');

document.getElementById('button-menu').addEventListener('click',switchVisibility)
document.getElementById('hm-friends').addEventListener('click',async ()=>{
    search.style.display='none';
    searchBF.style.display='inline';
    switchSidebar('friends');
    showFriends();
})
document.getElementById('search-ff').addEventListener('input',async (e)=>{
    searchUsersDB();
})
document.getElementById('search-bf').addEventListener('input',async (e)=>{
    let res = await fetch(`/search-friends?searchText=${searchBF.value}`,{method:'GET'});
    if(res.ok){
        let friends = await res.json();
        console.log(friends);
        const friendsHTML = document.getElementById('location-of-friends');
        if(friends.length===0){
            friendsHTML.innerHTML = '<p class="friends-info">Друзей с таким именем или логином не найдены</p>';
        }
        else{
            friendsHTML.innerHTML='';
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
})
document.getElementById('hm-account').addEventListener('click',()=>{
    search.style.display='none';
    switchSidebar('user');
})
document.getElementById('hm-create-conversation').addEventListener('click',()=>{
    search.style.display='none';
    switchSidebar('create-conversation');
})
document.getElementById('button-arrow').addEventListener('click',()=>{
    menu.style.display='inline';
    buttonArrow.style.display='none';
    chats.style.display = 'block';
    const sidebar = document.getElementById(selectedSidebar);
    sidebar.style.display = 'none';
    search.style.display='inline';
    searchBF.style.display='none';
})
document.getElementById('friends-search').addEventListener('click',()=>{
    friends.style.display = 'none';
    searchFriends.style.display = 'block';
    buttonArrowFriends.style.display = 'inline';
    buttonArrow.style.display = 'none';
    searchBF.style.display='none';
    searchFF.style.display='inline';
    searchUsersDB();
})
document.getElementById('button-arrow-friends').addEventListener('click',()=>{
    friends.style.display = 'block';
    searchFriends.style.display = 'none';
    searchFF.style.display='none';
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
        }
    }
});

function switchSidebar(e){
    selectedSidebar=e;
    menu.style.display='none';
    buttonArrow.style.display='inline';
    const elem = document.getElementById(e);
    chats.style.display = 'none';
    elem.style.display = 'block';
    switchVisibility();
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
    let res = await fetch(`/dialog/${id.attributes["name"].value}`,{method:'GET'});
    if(res.ok){
        let result = await res.json();
        selectedChat = result.chat._id;
        selectedChatName = name;
        displayСhat(result);
    }
}

function displayСhat(result){
    let messageField = document.getElementById('message-field');
    messageField.innerHTML = '';
    const chatOnly1 = document.getElementById('chat-only-1');
    chatOnly1.style.display='flex';
    const chatOnly2 = document.getElementById('chat-only-2');
    chatOnly2.style.display='flex';
    const conversationName = document.getElementById('conversation-name');
    conversationName.textContent=selectedChatName;
    if(result.chat.messages.length===0){
        messageField.innerHTML = '<p class="chat-info ">Сообщений пока нету</p>';
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
}