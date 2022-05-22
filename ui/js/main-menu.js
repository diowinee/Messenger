let menuVisibility = false;
let menuVisibilityRight = false;
let selectedSidebar;
const months = ['Янв.', 'Февр.', 'Марта', 'Апр.', 'Мая', 'Июня', 'Июля', 'Авг.', 'Сент.', 'Окт.', 'Нояб.', 'Дек.'];

let selectedChat;
let selectedChatName;
let selectedDiscussion;
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

const filePhoto = document.getElementById('user-file-photo');
filePhoto.addEventListener('change',()=>{
    const url = URL.createObjectURL(filePhoto.files[0]);
    userAvatar.style.backgroundImage = `url('${url}')`;
})
const userAvatar = document.getElementById('user-avatar');
userAvatar.addEventListener('click',()=>{
    filePhoto.click();
})
const conversationInputFile = document.getElementById('conversation-input-file');
conversationInputFile.addEventListener('change',()=>{
    const url = URL.createObjectURL(conversationInputFile.files[0]);
    discussionAvatar.style.backgroundImage = `url('${url}')`;
})
const discussionAvatar = document.getElementById('discussion-avatar');
discussionAvatar.addEventListener('click',()=>{
    conversationInputFile.click();
})

const userFilePhotoSettings = document.getElementById('user-file-photo-settings');
userFilePhotoSettings.addEventListener('change',()=>{
    const url = URL.createObjectURL(userFilePhotoSettings.files[0]);
    discussionAvatarInput.style.backgroundImage = `url('${url}')`;
})

const discussionAvatarInput = document.getElementById('discussion-avatar-input');
discussionAvatarInput.addEventListener('click',()=>{
    userFilePhotoSettings.click();
})

const file = document.getElementById('upload-file');
file.addEventListener('change',async ()=>{
    const fileMessage = new FormData();
    fileMessage.append("file", file.files[0])
    const res = await fetch(`/chat/${selectedChat}/file-message`,{method:'POST',body:fileMessage});
    if(res.ok){
        const res2 = await fetch(`/chat/${selectedChat}/message`,{method:'GET'});
        if(res2.ok){
            const result = await res2.json();
            displayChat(result);
            getChats();
        }
    }
})
document.getElementById('write-message-attach').addEventListener('click',()=>{
    file.click();
})
document.getElementById('hm-logout').addEventListener('click',async ()=>{
    document.cookie = 'token=; Expires=-1;';
    window.location.href=window.location.href;
});
document.getElementById('notes').addEventListener('click',async ()=>{
    openNotes();
})
async function openNotes(){
    const res = await fetch('/chat/notes',{method:'GET'});
    if(res.ok){
        const result = await res.json();
        const selected = document.getElementsByName(selectedChat);
        if(selected[0]) selected[0].classList.remove("selected");
        selectedChat = result.chat._id;
        selectedChatName = 'Заметки';
        displayChat(result);
    } 
}
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

    let res = await fetch(`/chat/${selectedDiscussion}/friends`,{method:'GET'});
    if(res.ok){
        let friends = await res.json();
        fillingFriendsForСonversation(friends);
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
    let res = await fetch(`/chat/${selectedDiscussion}/search-friends?searchText=${searchFD.value.trim()}`,{method:'GET'});
    if(res.ok){
        let friends = await res.json();
        fillingFriendsForСonversation(friends);
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
    const res = await fetch(`/chat/${selectedDiscussion}/participants`,{method:'GET'})
    if(res.ok){
        let result = await res.json();
        const participantsHTML = document.getElementById('location-of-participants');
        participantsHTML.innerHTML='';
        creater=result.participants.creater;
        for(let x=0;x<result.participants.users.length;x++){
            if(result.participants.users[x].photo) img = `<img src="http://localhost:3000/img/users/${result.participants.users[x].photo}?${Math.random()}" alt="" class="avatar">`;
            else img = `<div class="avatar-text"><span>${result.participants.users[x].name.charAt(0).toUpperCase()}</span></div>`;
            if(result.participants.users[x]._id!==result.userId){
                let button='';
                if(creater===result.userId){
                    button=
                    `<button class="but-cross" onclick="deleteParticipant(this,event)">
                        <i class="icon-cross"></i> 
                    </button>`
                }
                participantsHTML.innerHTML +=
                `<div class="friend" onclick="openDialog(this,'${result.participants.users[x].name}')" name="${result.participants.users[x]._id}">
                    ${img}
                    <div class="text-block">
                        <div>
                            <p class="name ellipsis-2">${result.participants.users[x].name}</p><br>
                            <p class="message ellipsis-2">${result.participants.users[x].login}</p> 
                        </div>  
                    </div>
                    ${button}
                </div>`;
            }
            else{
                participantsHTML.innerHTML +=
                `<div class="friend" onclick="openNotes()">
                    ${img}
                    <div class="text-block">
                        <div>
                            <p class="name ellipsis-2">${result.participants.users[x].name}</p><br>
                            <p class="message ellipsis-2">${result.participants.users[x].login}</p> 
                        </div>  
                    </div>
                </div>`;
            }
        }
    }
});

document.getElementById('conversation-settings-send').addEventListener('click', async ()=>{
    const conversationSettingsInput = document.getElementById('conversation-settings-input');
    const res = await fetch(`/chat/${selectedChat}`,{method:'POST', headers:{"Content-Type":"application/json"},body:JSON.stringify({title:conversationSettingsInput.value.trim()})});
    if(res.ok){
        const conversationName = document.getElementById('conversation-name');
        conversationName.textContent=conversationSettingsInput.value.trim();
        const userFilePhotoSettings = document.getElementById('user-file-photo-settings');
        if(userFilePhotoSettings.files[0]){
            const result = await res.json();
            let formData = new FormData();
            formData.append('file', userFilePhotoSettings.files[0]);
            const res2 = await fetch(`/chat/${result}/modification/avatar`,{method:"POST",body:formData})
            if(res2.ok){
                const result2 = await res2.json();
                const conversationAvatar = document.getElementById("conversation-avatar");
                const conversationAvatarText = document.getElementById("conversation-avatar-text");
                const conversationAvatarTextSpan = document.getElementById("conversation-avatar-text-span");
                if(result2) {
                    conversationAvatarText.style.display = "none";
                    conversationAvatar.style.display = "inline-block";
                    conversationAvatar.src = `/img/conversations/${result2.avatar}?${Math.random()}`;
                }
                else {
                    conversationAvatarText.style.display = "inline-flex";
                    conversationAvatar.style.display = "none";
                    conversationAvatarTextSpan.textContent = selectedChatName.charAt(0).toUpperCase();
                }
            }
        }
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
        const discussionAvatarInput = document.getElementById('discussion-avatar-input');
        
        if(result.info.photo) discussionAvatarInput.style.backgroundImage = `url('/img/conversations/${result.info.photo}?${Math.random()}')`;
        else  discussionAvatarInput.style.backgroundImage = '';
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
    if(conversationInput.value.trim()!==''){
        const res = await fetch('/chats',{method:'POST',headers:{"Content-Type":"application/json"},body:JSON.stringify({title:conversationInput.value.trim()})});
        if(res.ok){
            const conversationInputFile = document.getElementById('conversation-input-file');
            const result = await res.json();
            if(conversationInputFile.files[0]){
                let formData = new FormData();
                formData.append('file', conversationInputFile.files[0]);
                const res2 = await fetch(`/chat/${result._id}/modification/avatar`,{method:"POST",body:formData})
            }
            const res3 = await fetch(`/chat/${result._id}/message`,{method:'GET'});
            if(res3.ok){
                const result2 = await res3.json();
                selectedChatName = conversationInput.value.trim();
                console.log(result)
                selectedChat = result._id;
                selectedDiscussion = result._id;
                creater = result.creater;
                displayChat(result2);
                buttonArrow.click();
            }
        }
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
    searchByFriends();
})

async function searchByFriends(){
    const friendsHTML = document.getElementById('location-of-friends');
    friendsHTML.innerHTML = '';
    const res = await fetch(`/search-requests?searchText=${searchBF.value.trim()}`,{method:'GET'});
    let requests;
    if (res.ok) {
        requests = await res.json();
        for(let x=0;x<requests.length;x++){
            let img;
            if(requests[x].photo) img = `<img src="http://localhost:3000/img/users/${requests[x].photo}?${Math.random()}" alt="" class="avatar">`;
            else img = `<div class="avatar-text"><span>${requests[x].name.charAt(0).toUpperCase()}</span></div>`;
            friendsHTML.innerHTML += 
            `<div class="friend new-application" onclick="openDialog(this,'${requests[x].name}')" name="${requests[x]._id}">
                ${img}
                <div class="text-block">
                    <div>
                        <p class="name ellipsis-3">${requests[x].name}</p><br>
                        <p class="message ellipsis-3">${requests[x].login}</p> 
                    </div>  
                </div>
                <button class="but-plus" onclick="addNewFriend(this,event)">
                    <i class="icon-plus"></i> 
                </button>
                <button class="but-cross" onclick="deleteRequest(this,event)">
                    <i class="icon-cross"></i> 
                </button>
            </div>`;
        }
    } 
    const res2 = await fetch(`/search-friends?searchText=${searchBF.value.trim()}`,{method:'GET'});
    let friends;
    if (res2.ok) {
        friends = await res2.json();
        for(let x=0;x<friends.length;x++){
            if(friends[x].photo) img = `<img src="http://localhost:3000/img/users/${friends[x].photo}?${Math.random()}" alt="" class="avatar">`;
            else img = `<div class="avatar-text"><span>${friends[x].name.charAt(0).toUpperCase()}</span></div>`;
            friendsHTML.innerHTML += 
            `<div class="friend" onclick="openDialog(this,'${friends[x].name}')" name="${friends[x]._id}">
                ${img}
                <div class="text-block">
                    <div>
                        <p class="name ellipsis-2">${friends[x].name}</p><br>
                        <p class="message ellipsis-2">${friends[x].login}</p> 
                    </div>  
                </div>
                <button class="but-cross" onclick="deleteFriend(this,event)">
                    <i class="icon-cross"></i> 
                </button>
            </div>`;
        }
    } 
    if((!res.ok&&!res2.ok)||(friends.length===0&&requests.length===0)){
        if(searchBF.value.trim()===''){
            friendsHTML.innerHTML = '<p class="friends-info">Здесь будет отображаться список ваших друзей</p>';
        }
        else{
            friendsHTML.innerHTML = '<p class="friends-info">Друзья с таким именем или логином не найдены</p>'
        }
    }
}

document.getElementById('hm-account').addEventListener('click',async ()=>{
    search.style.display='none';
    switchSidebar('user');
    switchVisibility();
    const res = await fetch('/user/info',{method:'GET'});
    if(res.ok){
        const info = await res.json();
        const userAvatar = document.getElementById('user-avatar')
        userAvatar.style.backgroundImage = `url('/img/users/${info.photo}?${Math.random()}')`;

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
    const res = await fetch(`/chat/${selectedChat}/text-message`,{method:'POST',headers:{"Content-Type":"application/json"},body:JSON.stringify({message: writeMessage.value.trim()})});
    writeMessage.value='';
    if(res.ok){
        const res2 = await fetch(`/chat/${selectedChat}/message`,{method:'GET'});
        if(res2.ok){
            const result = await res2.json();
            displayChat(result);
            getChats();
        }
    }
});

document.getElementById('new-user-send').addEventListener('click',async()=>{
    const userNewName = document.getElementById('user-new-name');
    const userOldPassword = document.getElementById('user-old-password')
    const userNewPassword = document.getElementById('user-new-password')
    let newData = {
        newName:`${userNewName.value.trim()}`,
        newPas:`${userNewPassword.value.trim()}`,
        oldPas:`${userOldPassword.value.trim()}`
    };
    const res = await fetch('/modification',{method:'POST',headers:{"Content-Type":"application/json"}, body:JSON.stringify(newData)});
    userOldPassword.value='';
    userNewPassword.value='';
    const filePhoto = document.getElementById('user-file-photo');
    if(filePhoto.files[0]){
        let formData = new FormData();
        formData.append('file', filePhoto.files[0]);
        const res2 = await fetch("/modification/avatar",{method:"POST",body:formData})
    }
    buttonArrow.click();
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
    let res = await fetch(`/search-users?searchText=${inputSearch.value.trim()}`,{method:'GET'});
    if(res.ok){
        let users = await res.json();
        const usersHTML = document.getElementById('search-friends');
        if(users.length===0){
            usersHTML.innerHTML = '<p class="friends-info">Пользователи с таким именем или логином не найдены</p>';
        }
        else{
            usersHTML.innerHTML='';
            for(let x=0;x<users.length;x++){
                if(users[x].photo) img = `<img src="http://localhost:3000/img/users/${users[x].photo}?${Math.random()}" alt="" class="avatar">`;
                else img = `<div class="avatar-text"><span>${users[x].name.charAt(0).toUpperCase()}</span></div>`;
                usersHTML.innerHTML +=
                `<div class="a-user" onclick="openDialog(this,'${users[x].name}')" name="${users[x]._id}">
                    ${img}
                    <div class="text-block">
                        <div>
                            <p class="name ellipsis-2">${users[x].name}</p><br>
                            <p class="message ellipsis-2">${users[x].login}</p> 
                        </div>  
                    </div>
                    <button class="but-cross" name="${users[x]._id}" onclick="addNewRequest(this,event)">
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

async function addNewRequest(friend,event){
    event.stopPropagation();
    let res = await fetch('/friends/requests',{method:'POST',headers:{"Content-Type":"application/json"},body:JSON.stringify({friendId:`${friend.name}`})})
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
    let res = await fetch(`/chat/${selectedDiscussion}/participants`,{method:'POST', headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:friend.parentNode.attributes["name"].value})});
    if(res.ok){
        let res2 = await fetch(`/chat/${selectedDiscussion}/friends`,{method:'GET'});
        if(res2.ok){
            let friends = await res2.json();
            fillingFriendsForСonversation(friends);
        }
    }

}
async function deleteParticipant(friend,event){
    event.stopPropagation();
    let res = await fetch(`/chat/${selectedDiscussion}/participant`,{method:'DELETE', headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:friend.parentNode.attributes["name"].value})});
    if(res.ok){
        searchParticipants();
    }
}

async function showFriends(){
    const friendsHTML = document.getElementById('location-of-friends');
    friendsHTML.innerHTML = '';
    const res = await fetch("/friends/requests",{method:"GET"});
    let requests;
    if (res.ok) {
        requests = await res.json();
        for(let x=0;x<requests.length;x++){
            let img;
            if(requests[x].photo) img = `<img src="http://localhost:3000/img/users/${requests[x].photo}?${Math.random()}" alt="" class="avatar">`;
            else img = `<div class="avatar-text"><span>${requests[x].name.charAt(0).toUpperCase()}</span></div>`;
            friendsHTML.innerHTML += 
            `<div class="friend new-application" onclick="openDialog(this,'${requests[x].name}')" name="${requests[x]._id}">
                ${img}
                <div class="text-block">
                    <div>
                        <p class="name ellipsis-3">${requests[x].name}</p><br>
                        <p class="message ellipsis-3">${requests[x].login}</p> 
                    </div>  
                </div>
                <button class="but-plus" onclick="addNewFriend(this,event)">
                    <i class="icon-plus"></i> 
                </button>
                <button class="but-cross" onclick="deleteRequest(this,event)">
                    <i class="icon-cross"></i> 
                </button>
            </div>`;
        }
    } 
    const res2 = await fetch("/friends",{method:"GET"});
    let friends;
    if (res2.ok) {
        friends = await res2.json();
        for(let x=0;x<friends.length;x++){
            let img;
            if(friends[x].photo) img = `<img src="http://localhost:3000/img/users/${friends[x].photo}?${Math.random()}" alt="" class="avatar">`;
            else img = `<div class="avatar-text"><span>${friends[x].name.charAt(0).toUpperCase()}</span></div>`;
            friendsHTML.innerHTML += 
            `<div class="friend" onclick="openDialog(this,'${friends[x].name}')" name="${friends[x]._id}">
                ${img}
                <div class="text-block">
                    <div>
                        <p class="name ellipsis-2">${friends[x].name}</p><br>
                        <p class="message ellipsis-2">${friends[x].login}</p> 
                    </div>  
                </div>
                <button class="but-cross" onclick="deleteFriend(this,event)">
                    <i class="icon-cross"></i> 
                </button>
            </div>`;
        }
    } 
    if((!res.ok&&!res2.ok)||(friends.length===0&&requests.length===0)){
        friendsHTML.innerHTML = '<p class="friends-info">Здесь будет отображаться список ваших друзей</p>';
    }
}

async function deleteRequest(friend,event){
    event.stopPropagation();
    let res = await fetch(`/friends/requests/${friend.parentNode.attributes["name"].value}`,{method:'DELETE'})
    if(res.ok){
        searchByFriends();
    }
}

async function addNewFriend(friend,event){
    event.stopPropagation();
    let res = await fetch('/friends',{method:'POST',headers:{"Content-Type":"application/json"},body:JSON.stringify({friendId:`${friend.parentNode.attributes["name"].value}`})})
    if(res.ok){
        searchByFriends();
    }
}

async function openDialog(id,name){
    let res = await fetch(`/chat/friends/${id.attributes["name"].value}`,{method:'GET'});
    if(res.ok){
        let result = await res.json();
        selectedChat = result.chat._id;
        selectedChatName = name;
        displayChat(result);
    }
}
async function downloadFile(id,extension,name){
    console.log(id)
    console.log(extension)
    window.open(`/chat/download/${id+extension}`);
}
function displayChat(result){
    console.log(result)
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
    let photo;
    const conversationBlock1 = document.getElementById('conversation-block-1');
    const conversationBlock2 = document.getElementById('conversation-block-2');
    if(selectedChatName==="Заметки"){
        conversationBlock1.style.display = "none";
        conversationBlock2.style.display = "flex";

    }
    else{
        conversationBlock2.style.display = "none";
        conversationBlock1.style.display = "flex";
    }
    if(result.chat.isPrivate) {
        if(result.chat.photo) photo = 'conversations/'+result.chat.photo;
    }
    else{
        if(result.chat.users[0]._id!==result.mainUserId||result.chat.users.length===1) {
            if(result.chat.users[0].photo) photo = 'users/'+result.chat.users[0].photo
        }
        else {
            if(result.chat.users[1].photo) photo = 'users/'+result.chat.users[1].photo
        }
    }
    const conversationAvatar = document.getElementById("conversation-avatar");
    const conversationAvatarText = document.getElementById("conversation-avatar-text");
    const conversationAvatarTextSpan = document.getElementById("conversation-avatar-text-span");
    if(photo) {
        conversationAvatarText.style.display = "none";
        conversationAvatar.style.display = "inline-block";
        conversationAvatar.src = `http://localhost:3000/img/${photo}?${Math.random()}`;
    }
    else {
        conversationAvatarText.style.display = "inline-flex";
        conversationAvatar.style.display = "none";
        conversationAvatarTextSpan.textContent = selectedChatName.charAt(0).toUpperCase();
    }
    if(result.chat.messages.length===0){
        messageField.innerHTML = '<p class="chat-info">Сообщений пока нету</p>';
    }
    for(let x=0;x<result.chat.messages.length;x++){
        let date = new Date(result.chat.messages[x].createdDate); 
        const datenow = new Date();
        if(date.getMinutes()<10){
            date = `${date.getHours()}:${'0' + date.getMinutes()}`;
        }
        else{
            date = `${date.getHours()}:${date.getMinutes()}`;
        }
        if(result.mainUserId===result.chat.messages[x].user._id){
            if(result.chat.messages[x].models==='FileMessage'){
                messageField.innerHTML += `
                <div class="my-message chat-file-pad" onclick="downloadFile('${result.chat.messages[x].modelId._id}','${result.chat.messages[x].modelId.extension}','${result.chat.messages[x].modelId.name}')">
                    <div class="chat-message">
                        <div class="chat-file">
                            <div class="chat-icon-file"><i class="icon-file"></i></div>
                            <div class="chat-text-block">
                                <p class="chat-text chat-text-file-name file-width">${result.chat.messages[x].modelId.name}</p>
                                <p class="chat-text chat-text-file-size file-width">${formatBytes(result.chat.messages[x].modelId.size)}</p>
                            </div>
                        </div>
                        <p class="chat-text chat-text-time">${date}</p>
                    </div>
                </div>`; 
            }
            else{
                messageField.innerHTML += `
                <div class="my-message">
                    <div class="chat-message">
                        <p class="chat-text text-transfer">${result.chat.messages[x].modelId.text}</p>
                        <p class="chat-text chat-text-time">${date}</p>
                    </div>
                </div>`
            }
        }
        else{
            let img;
            if(result.chat.messages[x].user.photo) img = `<img src="http://localhost:3000/img/users/${result.chat.messages[x].user.photo}?${Math.random()}" alt="" class="chat-avatar">`;
            else img = `<div class="chat-avatar-text"><span>${result.chat.messages[x].user.name.charAt(0).toUpperCase()}</span></div>`;
            if(result.chat.messages[x].models==='FileMessage'){
                messageField.innerHTML += `
                <div class="interlocutor chat-file-pad" onclick="downloadFile('${result.chat.messages[x].modelId._id}','${result.chat.messages[x].modelId.extension}','${result.chat.messages[x].modelId.name}')">
                    ${img}
                    <div class="chat-message">
                        <div>
                            <p class="chat-name message-name-width">${result.chat.messages[x].user.name}</p>
                            <div class="chat-file">
                                <div class="chat-icon-file"><i class="icon-file"></i></div>
                                <div class="chat-text-block">
                                    <p class="chat-text chat-text-file-name file-width">${result.chat.messages[x].modelId.name}</p>
                                    <p class="chat-text chat-text-file-size file-width">${formatBytes(result.chat.messages[x].modelId.size)}</p>
                                </div>
                            </div>
                        </div>
                        <p class="chat-text chat-text-time">${date}</p>
                    </div>
                </div>`;
            }
            else{
                messageField.innerHTML += `
                <div class="interlocutor">
                    ${img}
                    <div class="chat-message">            
                        <div>
                            <p class="chat-name message-name-width">${result.chat.messages[x].user.name}</p>
                            <p class="chat-text text-transfer">${result.chat.messages[x].modelId.text}</p>
                        </div>
                        <p class="chat-text chat-text-time">${date}</p>
                    </div>
                </div>`;
            }
        }
    }
    const messageContainer = document.getElementById('message-container');
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function formatBytes(bytes) {
    const decimals = 2
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

async function getChats(){
    const res = await fetch('/chats',{method:'GET'});
    if(res.ok){
        const result = await res.json();
        console.log(result)
        const containerChats = document.getElementById('container-chats');
        containerChats.innerHTML='';
        if(result.chats.length === 0){
            containerChats.innerHTML = '<p class="friends-info">Здесь будет отображаться список ваших чатов</p>'
        }
        for(let x=0;x<result.chats.length;x++){
            let name,date,message,photo,photoName,img;
            if(!(!result.chats[x].isPrivate&&result.chats[x].users.length===1)){
                if(result.chats[x].isPrivate) {
                    name=result.chats[x].title;
                    if(result.chats[x].photo) photo = 'conversations/'+result.chats[x].photo;
                }
                else{
                    if(result.chats[x].users[0]._id!==result.userId) {
                        name=result.chats[x].users[0].name;
                        if(result.chats[x].users[0].photo) photo = 'users/'+result.chats[x].users[0].photo
                    }
                    else {
                        name=result.chats[x].users[1].name
                        if(result.chats[x].users[1].photo) photo = 'users/'+result.chats[x].users[1].photo
                    }
                }
                if(result.chats[x].messages.length===0){
                    message='Беседа создана';
                    date = new Date(result.chats[x].createdDate); 
                }
                else if(result.chats[x].messages[result.chats[x].messages.length-1].models==='TextMessage'){
                    message=result.chats[x].messages[result.chats[x].messages.length-1].modelId.text;
                    date = new Date(result.chats[x].messages[result.chats[x].messages.length-1].createdDate); 
                }
                else{
                    message='Файл';
                    date = new Date(result.chats[x].messages[result.chats[x].messages.length-1].createdDate); 
                }
                const datenow = new Date();
                if(Math.floor((datenow - date) / (60 * 60 * 24 * 1000))>365){
                    date = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
                }
                else if(Math.floor((datenow - date) / (60 * 60 * 24 * 1000))>0){
                    date = `${date.getDate()} ${months[date.getMonth()]}`;
                }
                else{
                    if(date.getMinutes()<10){
                        date = `${date.getHours()}:${'0' + date.getMinutes()}`;
                    }
                    else{
                        date = `${date.getHours()}:${date.getMinutes()}`;
                    }
                }
                if(photo) img = `<img src="http://localhost:3000/img/${photo}?${Math.random()}" alt="" class="avatar">`;
                else img = `<div class="avatar-text"><span>${name.charAt(0).toUpperCase()}</span></div>`;
                containerChats.innerHTML += 
                    `<div class="chat" onclick="openChat(this,'${name}')" name="${result.chats[x]._id}">
                        ${img}
                        <div class="text-block">
                            <div class="ctb-div">
                                <p class="name ellipsis">${name}</p>
                                <p class="time">${date}</p>
                            </div>  
                            <div class="ctb-div">
                                <p class="message ellipsis">${message}</p> 
                            </div>
                        </div>
                    </div>`;
                     // <img src="../ui/img/ellipse.svg" alt="" class="viewed">
                if(result.chats[x]._id===selectedChat){
                    const selectedChatObj = document.getElementsByName(selectedChat);
                    selectedChatObj[0].classList.add("selected");
                } 
            }
            else{
                const notes = document.getElementById('notes-message')
                if(result.chats[x].messages[result.chats[x].messages.length-1].models==='TextMessage'){
                    notes.textContent = result.chats[x].messages[result.chats[x].messages.length-1].modelId.text;
                }
                else{
                    notes.textContent = 'Файл';
                }
            }
        }
    }
}

async function openChat(id,name){
    let res = await fetch(`/chats/${id.attributes["name"].value}`,{method:'GET'});
    if(res.ok){
        let result = await res.json();
        const selected = document.getElementsByName(selectedChat);
        if(selected[0]) selected[0].classList.remove("selected");
        id.classList.add("selected");
        selectedChat = result.chat._id;
        if(result.chat.isPrivate) selectedDiscussion = result.chat._id;
        selectedChatName = name;
        displayChat(result);
    }
}

async function searchParticipants(){
    let res = await fetch(`/search-participants?searchText=${searchBP.value.trim()}&chatId=${selectedDiscussion}`,{method:'GET'});
    if(res.ok){
        let result = await res.json();
        const participantsHTML = document.getElementById('location-of-participants');
        participantsHTML.innerHTML='';
        for(let x=0;x<result.participants.length;x++){
            if(result.participants[x].photo) img = `<img src="http://localhost:3000/img/users/${result.participants[x].photo}?${Math.random()}" alt="" class="avatar">`;
            else img = `<div class="avatar-text"><span>${result.participants[x].name.charAt(0).toUpperCase()}</span></div>`;
            if(result.participants[x]._id!==result.userId){
                let button='';
                if(creater===result.userId){
                    button=
                    `<button class="but-cross" onclick="deleteParticipant(this,event)">
                        <i class="icon-cross"></i> 
                    </button>`
                }
                participantsHTML.innerHTML +=
                `<div class="friend" onclick="openDialog(this,'${result.participants[x].name}')" name="${result.participants[x]._id}">
                    ${img}
                    <div class="text-block">
                        <div>
                            <p class="name ellipsis-2">${result.participants[x].name}</p><br>
                            <p class="message ellipsis-2">${result.participants[x].login}</p> 
                        </div>  
                    </div>
                    ${button}
                </div>`;
            } else{
                participantsHTML.innerHTML +=
                `<div class="friend" onclick="openNotes()">
                    ${img}
                    <div class="text-block">
                        <div>
                            <p class="name ellipsis-2">${result.participants[x].name}</p><br>
                            <p class="message ellipsis-2">${result.participants[x].login}</p> 
                        </div>  
                    </div>
                </div>`;
            }  
        }
    }
}

function fillingFriendsForСonversation(friends){
    const friendsHTML = document.getElementById('location-add-users');
    if(friends.length===0){
        if(searchFD.value.trim()===''){
            friendsHTML.innerHTML = '<p class="friends-info">Здесь будет отображаться список ваших друзей</p>';
        }
        else{
            friendsHTML.innerHTML = '<p class="friends-info">Друзья с таким именем или логином не найдены</p>'
        }
    }
    else{
        friendsHTML.innerHTML='';
        for(let x=0;x<friends.length;x++){
            let img;
            if(friends[x].photo) img = `<img src="http://localhost:3000/img/users/${friends[x].photo}?${Math.random()}" alt="" class="avatar">`;
            else img = `<div class="avatar-text"><span>${friends[x].name.charAt(0).toUpperCase()}</span></div>`;
            friendsHTML.innerHTML +=
            `<div class="friend" onclick="openDialog(this,'${friends[x].name}')" name="${friends[x]._id}">
               ${img}
                <div class="text-block">
                    <div>
                        <p class="name ellipsis-2">${friends[x].name}</p><br>
                        <p class="message ellipsis-2">${friends[x].login}</p> 
                    </div>  
                </div>
                <button class="but-plus" onclick="addParticipant(this,event)">
                    <i class="icon-plus"></i> 
                </button>
            </div>`;
        }
    }
}

getChats();