async function getCreatorPosts(){
    var res = await fetch('/creator/all-posts')
    var json = await res.json();
    return json;
}

async function getOwnProducts(creatorTag){
    var res = await fetch(`/creator/products/own/${creatorTag}`);
    var json = await res.json();
    return json;
}

async function getMadeProducts(creatorTag){
    var res = await fetch(`/creator/products/made/${creatorTag}`);
    var json = await res.json();
    return json;
}

async function getCreators(){
    var res = await fetch('/creator/all-creators');
    var json = await res.json();
    return json;
}

async function getProduct(productID){
    var res = await fetch(`/creator/products/${productID}`);
    var json = await res.json();
    return json;
}

async function getCreatorPortalProduct(productID, username){
    var res = await fetch(`/creator/products/portal/${productID}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            productID: productID
        })
    })
    var json = await res.json();
    return json;
}

async function getCreatorProducts(creatorTag){
    var res = await fetch(`/creator/products/all/${creatorTag}`);
    var json = await res.json();
    return json;
}

async function addProduct(data){
    var res = await fetch('/creator/products/add', {
        method: "POST",
        body: new FormData(data)
    });
    var json = await res.json();
    return json;
}

async function removeProduct(productID){
    var res = await fetch('/creator/products/remove', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productID: productID })
    });
    var json = await res.json();
    return json;
}

async function updateProduct(formData){
    var res = await fetch('/creator/products/update', {
        method: "POST",
        body: formData
    });
    var json = await res.json();
    return json;
}

export { 
    getCreatorPortalProduct,
    getCreatorPosts,
    getOwnProducts,
    getMadeProducts,
    getCreators,
    getProduct,
    getCreatorProducts,
    addProduct,
    removeProduct,
    updateProduct
};