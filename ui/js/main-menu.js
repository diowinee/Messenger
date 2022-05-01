let menuVisibility = false;
let selectedSidebar;

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
    searchFriendsDB();
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
    searchFriendsDB();
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

async function searchFriendsDB(){
    const inputSearch = document.getElementById('search-ff');
    let res = await fetch(`/search-friends?searchText=${inputSearch.value}`,{method:'GET'});
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
                `<div class="chat">
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
}

async function addNewFriend(friend){
    let res = await fetch('/friends',{method:'POST',headers:{"Content-Type":"application/json"},body:JSON.stringify({friendId:`${friend.name}`})})
    if(res.ok){
        searchFriendsDB();
    }
}
async function deleteFriend(friend){
    let res = await fetch(`/friends?friendId=${friend.name}`,{method:'DELETE'})
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
                `<div class="friend">
                    <img src="../ui/img/0.jpg" alt="" class="avatar">
                    <div class="text-block">
                        <div>
                            <p class="name">${friends[x].name}</p><br>
                            <p class="message">${friends[x].login}</p> 
                        </div>  
                    </div>
                    <button class="but-cross" name="${friends[x]._id}" onclick="deleteFriend(this)">
                        <i class="icon-cross"></i> 
                    </button>
                </div>`;
            }
        }
    } 
}