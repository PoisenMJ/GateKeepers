async function getProfile(username, token){
    var res = await fetch('/user/profile', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            token: token,
            username: username
        })
    });
    var json = await res.json();
    if(json.success) return json;
    else return { success: false };
}

async function updatePassword(password, username, token){
    var res = await fetch('/user/update-password', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            token: token,
            username: username,
            password: password
        })
    });
    var json = await res.json();
    return json;
}

export { getProfile, updatePassword };