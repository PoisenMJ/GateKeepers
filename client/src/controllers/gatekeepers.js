async function login(username, password){
    var res = await fetch('/gatekeeper/login', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            password
        })
    });
    var json = await res.json();
    return json;
}

async function addOutfit(username, token, name, items, image){
    var formData = new FormData();
    formData.append('username', username);
    formData.append('token', token);
    formData.append('name', name);
    formData.append('items', JSON.stringify(items));
    formData.append('outfitImg', image);
    console.log(...formData);

    var res = await fetch('/gatekeeper/outfit/create', {
        method: "POST",
        body: formData,
    });
    var json = await res.json();
    return json;
}

async function deleteOutfit(username, token, outfitID){
    var res = await fetch('/gatekeeper/outfit/delete', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            token,
            outfitID
        })
    })
    var json = await res.json();
    return json;
}

async function getOutfits(username){
    var res = await fetch(`/gatekeeper/outfit/all/${username}`);
    var json = await res.json();
    return json;
}

async function addProduct(data, username, token, order, images, customSize, sizes){
    var data = new FormData(data);
    data.append('username', username);
    data.append('token', token);
    data.append('imageOrder', order);
    data.append('customSizeAccept', customSize);
    data.append('sizes', sizes);

    for(var i = 0; i < images.length; i++){
        data.append("images", images[i]);
    }

    var moneyInput = data.get('price').split(",").join("");
    data.set('price', moneyInput);
    var uri = data.get('name').toLowerCase().replace(' ', '_').concat('_').concat(username);
    data.append('uri', uri);

    var res = await fetch('/gatekeeper/products/add', {
        method: "POST",
        body: data
    });
    var json = await res.json();
    return json;
}

async function getOrders(username, token){
    var res = await fetch('/gatekeeper/orders', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, token })
    });
    var json = await res.json();
    return json;
}

async function removeProduct(productID, username, token){
    var res = await fetch('/gatekeeper/products/remove', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productID, username, token })
    });
    var json = await res.json();
    return json;
}

async function markOrderSent(orderID, username, token){
    var res = await fetch('/gatekeeper/orders/mark-sent', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            token,
            orderID
        })
    });
    var json = await res.json();
    return json;
}

async function updateProduct(formData, username, token){
    formData.append('token', token);
    formData.append('username', username);
    var res = await fetch('/gatekeeper/products/update', {
        method: "POST",
        body: formData
    });
    var json = await res.json();
    return json;
}

async function getProduct(productID, username, token){
    var res = await fetch(`/gatekeeper/products/${productID}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, username, productID })
    })
    var json = await res.json();
    return json;
}

async function getProducts(username, token){
    var res = await fetch(`/gatekeeper/products/all/${username}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, username })
    });
    var json = await res.json();
    return json;
}

async function getGatekeeper(username, token){
    var res = await fetch(`/gatekeeper/${username}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, username })
    });
    var json = await res.json();
    return json;
}


// TODO:need token
async function updateGatekeeper(data, username){
    var res = await fetch(`/gatekeeper/update/${username}`, {
        method: "POST",
        body: data
    });
    var json = await res.json();
    return json;
}

async function getGatekeeperCustomsMessages(username, token){
    var res = await fetch('/gatekeeper/custom/all', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            token
        })
    })
    var json = await res.json();
    return json;
}

async function acceptGatekeeperCustom(username, token, user){
    var res = await fetch('/gatekeeper/custom/accept', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            token,
            user
        })
    })
    var json = await res.json();
    return json;
}

async function declineGatekeeperCustom(username, token, user){
    var res = await fetch('/gatekeeper/custom/decline', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            token,
            user
        })
    })
    var json = await res.json();
    return json;
}

async function sendCustomsMessage(username, token, message, to, type){
    var res = await fetch('/gatekeeper/custom/send-message', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            token,
            message,
            to,
            type
        })
    })
    var json = await res.json();
    return json;
}

async function markReadCustomsChat(username, token, to){
    var res = await fetch('/gatekeeper/custom/read', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            token,
            to
        })
    });
    var json = await res.json();
    return json;
}

async function hasCustomsOn(username){
    var res = await fetch(`/gatekeeper/custom/check?username=${username}`);
    var json = await res.json();
    return json;
}

export {
    addProduct,
    removeProduct,
    updateProduct,
    getProduct,
    getProducts,
    getGatekeeper,
    updateGatekeeper,
    getOrders,
    markOrderSent,
    login,
    addOutfit,
    getOutfits,
    deleteOutfit,
    getGatekeeperCustomsMessages,
    acceptGatekeeperCustom,
    declineGatekeeperCustom,
    sendCustomsMessage,
    markReadCustomsChat,
    hasCustomsOn
}