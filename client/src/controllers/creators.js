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

async function getProduct(productURI, type){
    var res = await fetch(`/creator/products/${productURI}/${type}`);
    var json = await res.json();
    return json;
}

async function getCreatorShippingCountries(creatorTag){
    var res = await fetch(`/creator/shipping/${creatorTag}`);
    var json = await res.json();
    return json;
}

async function getMultipleCreatorsShippingCountries(...creators){
    var res = await fetch('/creator/shipping/multiple', {
        method: "POST",
        body: JSON.stringify({
            users: creators
        })
    })
}

export {
    getCreatorPosts,
    getOwnProducts,
    getMadeProducts,
    getCreators,
    getProduct,
    getCreatorShippingCountries
};