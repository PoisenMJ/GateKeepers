// TODO: if its httponly cookie check that instead

function checkTokenExpiration(){

}

function checkToken(){
    var token = localStorage.getItem("token");
    var username = localStorage.getItem("username");
    return fetch('/auth/check-token', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token, username: username })
    }).then(raw => raw.json()).then(json => {
        if(json.success) return true;
        else {
            // console.log("DELETING TOKENS");
            // // TODO: abstract token writing and deleting
            // localStorage.removeItem('token');
            // localStorage.removeItem('username');
            return false;
        }
    })
}

async function checkCreatorToken() {
    var token = localStorage.getItem("token");;
    var username = localStorage.getItem("username");
    return fetch('/auth/check-creator-token', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token, username: username })
    }).then(raw => raw.json()).then(json => {
        if(json.success) return true;
        else {
            // console.log("DELETING CREATOR TOKEN");
            // localStorage.removeItem('token');
            // localStorage.removeItem('username');
            return false;
        }
    })
}

function LogOut(){
    console.log("Log Out");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("auth");
    localStorage.removeItem("cart");
    localStorage.removeItem("cartTotal");
}

export { checkTokenExpiration, checkToken, checkCreatorToken, LogOut };