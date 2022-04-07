document.getElementById("change-login").addEventListener("click",()=>{changeForm("change-login")});
document.getElementById("change-reg").addEventListener("click",()=>{changeForm("change-reg")});

document.getElementById("login").addEventListener("click",async ()=>{
    let login = document.getElementById("login-login");
    let password = document.getElementById("login-password");

    if(login.value!==""&&password.value!==""){
        let log = {
            login: `${login}`,
            password: `${password}`
        }
        await fetch("/login",{method:"POST",body:JSON.stringify(log)})
    }
    else {
        if(login.value==="") border(login);
        if(password.value==="") border(password);
    }
});

document.getElementById("reg-create").addEventListener("click",async ()=>{
    let login = document.getElementById("reg-login");
    let name = document.getElementById("reg-name");
    let password = document.getElementById("reg-password");
    let repeatPassword = document.getElementById("reg-repeat-password");

    if(login.value!==""&&name.value!==""&&password.value!==""&&password.value===repeatPassword){
        let reg = {
            login: `${login}`,
            name: `${name}`,
            password: `${password}`
        }
        await fetch("/registration",{method:"POST",body:JSON.stringify(reg)})
    }
    else {
        if(login.value==="") border(login);
        if(name.value==="") border(name);
        if(password.value==="") border(password);
        if(password.value===""||password.value!==repeatPassword.value) border(repeatPassword);
    }
});

function border(input){
    input.style.outlineStyle="solid";
    input.style.outlineColor="var(--error)";
    setTimeout(()=>{
        input.style.outlineStyle="";
        input.style.outlineColor="var(--input-text)";
    }, 500);
}
function changeForm(form){
    let login = document.getElementById("login-form");
    let reg = document.getElementById("reg-form");
    if(form==="change-login") {
        login.style.display="none";
        reg.style.display="block";
    }
    else {
        reg.style.display="none";
        login.style.display="block";
    }
}