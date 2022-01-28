async function recoverPassword(username, token, newPassword){
    var res = await fetch('/user/recover-password', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            token,
            newPassword
        })
    });
    var json = await res.json();
    return json;
}

async function changePassword(username, token, newPassword, updateToken){
    var res = await fetch('/user/change-password', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            token,
            newPassword,
            updateToken
        })
    })
    var json = await res.json();
    return json;
}

async function sendRecoveryEmail(email){
    var res = await fetch('/user/get-reset-password-token', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email
        })
    });
    var json = await res.json();
    return json;
}

async function sendPasswordChangeEmail(username, token){
    var res = await fetch('/user/email-change-password', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            token
        })
    });
    var json = await res.json();
    return json;
}

async function submitActivationToken(activationToken, username){
    var res = await fetch('/user/check-activation-token', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            activationToken: activationToken
        })
    });
    var json = await res.json();
    return json;
}

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

export { getProfile, submitActivationToken, recoverPassword, sendRecoveryEmail, sendPasswordChangeEmail, changePassword };