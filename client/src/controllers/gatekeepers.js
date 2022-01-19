async function addProduct(data, username, token){
    var data = new FormData(data);
    data.append('username', username);
    data.append('token', token);

    var moneyInput = data.get('price');
    data.set('price', moneyInput.substring(1, moneyInput.length))
    var uri = data.get('name').toLowerCase().replace(' ', '_').concat('_').concat(username);
    data.append('uri', uri);

    var res = await fetch('/gatekeeper/products/add', {
        method: "POST",
        body: data
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

async function updateGatekeeper(jsonData, username){
    var res = await fetch(`/gatekeeper/update/${username}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
    });
    var json = await res.json();
    console.log(json);
    return json;
}

export {
    addProduct,
    removeProduct,
    updateProduct,
    getProduct,
    getProducts,
    getGatekeeper,
    updateGatekeeper
}