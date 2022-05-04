document.getElementById("change-login").addEventListener("click",()=>{changeForm("change-login")});
document.getElementById("change-reg").addEventListener("click",()=>{changeForm("change-reg")});

document.getElementById("login").addEventListener("click",async ()=>{
    let login = document.getElementById("login-login");
    let password = document.getElementById("login-password");
    let err = document.getElementById("login-error");
    let text = document.getElementById("login-input-text");

    if(login.value!==""&&password.value!==""){
        let log = {
            login: `${login.value}`,
            password: `${password.value}`
        }
        let res = await fetch("/login",{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(log)});
        if(res.ok){
            let resObject = await res.json();
            window.location.href=window.location.href+resObject.redirectUrl;
        }
        else error(err,text);
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
    let err = document.getElementById("reg-error");
    let text = document.getElementById("reg-input-text");

    if(login.value!==""&&name.value!==""&&password.value!==""&&password.value===repeatPassword.value){
        let reg = {
            login: `${login.value}`,
            name: `${name.value}`,
            password: `${password.value}`
        }
        let res = await fetch("/registration",{method:"POST", headers: {'Content-Type': 'application/json'}, body:JSON.stringify(reg)});
        if(res.ok){
            let resObject = await res.json();
            window.location.href=window.location.href+resObject.redirectUrl;
        }
        else error(err,text);
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
function error(err,text){
    err.style.display = "block";
    text.style.marginBottom = "10px";
    setTimeout(()=>{
        err.style.display="none";
        text.style.marginBottom = "40px";
    }, 1000);
}