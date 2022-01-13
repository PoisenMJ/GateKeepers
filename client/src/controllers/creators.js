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

async function getProduct(productURI){
    var res = await fetch(`/creator/products/${productURI}`);
    var json = await res.json();
    return json;
}

export {
    getCreatorPosts,
    getOwnProducts,
    getMadeProducts,
    getCreators,
    getProduct
};