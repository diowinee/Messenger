document.getElementById("change-login").addEventListener("click",()=>{changeForm("change-login")});
document.getElementById("change-reg").addEventListener("click",()=>{changeForm("change-reg")});

document.getElementById("login").addEventListener("click",async ()=>{
    let login = document.getElementById("login-login");
    let password = document.getElementById("login-password");
    let err = document.getElementById("login-error");
    let text = document.getElementById("login-input-text");

    if(login.value.trim()!==""&&password.value.trim()!==""){
        let log = {
            login: `${login.value.trim()}`,
            password: `${password.value.trim()}`
        }
        let res = await fetch("/login",{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(log)});
        if(res.ok){
            let resObject = await res.json();
            sessionStorage.setItem('token',resObject.token);
            window.location.href=window.location.href+resObject.redirectUrl;
        }
        else error(err,text);
    }
    else {
        if(login.value.trim()==="") border(login);
        if(password.value.trim()==="") border(password);
    }
});

document.getElementById("reg-create").addEventListener("click",async ()=>{
    let login = document.getElementById("reg-login");
    let name = document.getElementById("reg-name");
    let password = document.getElementById("reg-password");
    let repeatPassword = document.getElementById("reg-repeat-password");
    let err = document.getElementById("reg-error");
    let text = document.getElementById("reg-input-text");
    let paserr = document.getElementById("pas-error");
    if(login.value.trim()!==""&&name.value.trim()!==""&&password.value.trim()!==""&&password.value.trim()===repeatPassword.value.trim()){
        if(password.value.trim().length>=8){
            let reg = {
                login: `${login.value.trim()}`,
                name: `${name.value.trim()}`,
                password: `${password.value.trim()}`
            }
            let res = await fetch("/registration",{method:"POST", headers: {'Content-Type': 'application/json'}, body:JSON.stringify(reg)});
            if(res.ok){
                let resObject = await res.json();
                sessionStorage.setItem('token',resObject.token);
                window.location.href=window.location.href+resObject.redirectUrl;
            }
            else error(err,text);
        }
        else{
            error(paserr,text);
        }
    }
    else {
        if(login.value.trim()==="") border(login);
        if(name.value.trim()==="") border(name);
        if(password.value.trim()==="") border(password);
        if(password.value.trim()===""||password.value.trim()!==repeatPassword.value.trim()) border(repeatPassword);
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
function error(err,text){
    err.style.display = "block";
    text.style.marginBottom = "10px";
    setTimeout(()=>{
        err.style.display="none";
        text.style.marginBottom = "40px";
    }, 1000);
}