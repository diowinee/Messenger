let menuVisibility = false;
document.getElementById('button-menu').addEventListener('click',()=>{
    const headerMenu = document.getElementById('header-menu');
    if(menuVisibility){
        menuVisibility=false;
        headerMenu.style.display = 'none';
    }
    else{
        menuVisibility=true;
        headerMenu.style.display = 'block';
    }
})