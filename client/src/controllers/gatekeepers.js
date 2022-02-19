async function addProduct(data, username, token, order, images, customSize){
    var data = new FormData(data);
    data.append('username', username);
    data.append('token', token);
    data.append('imageOrder', order);
    data.append('customSizeAccept', customSize);

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

async function updateGatekeeper(data, username){
    var res = await fetch(`/gatekeeper/update/${username}`, {
        method: "POST",
        body: data
    });
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
    markOrderSent
}