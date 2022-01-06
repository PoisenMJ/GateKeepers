// TODO: if its httponly cookie check that instead
function checkLoggedIn(){
    return localStorage.getItem('token') != null || localStorage.getItem('token') != '';
}

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
            // TODO: abstract token writing and deleting
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            return false;
        }
    })
}

export { checkLoggedIn, checkTokenExpiration, checkToken };