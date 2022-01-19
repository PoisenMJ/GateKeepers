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
    if(json.success) {
        var data = await getOrders(username, token);
        if(data.orders){
            return { profile: json.user, orders: data.orders, success: true };
        } else return { success: false }
    }
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

async function getOrders(username, token){
    var res = await fetch('/user/orders', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            token: token,
            username: username
        })
    })
    var json = await res.json();
    return json;
}

export { getProfile, updatePassword };