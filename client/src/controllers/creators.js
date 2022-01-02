async function getCreatorPosts(){
    var res = await fetch('/creator/all-posts')
    var json = await res.json();
    return json;
}

async function getWornByProducts(creatorTag){
    var res = await fetch(`/creator/products/worn-by/${creatorTag}`);
    var json = await res.json();
    return json;
}

async function getMadeProducts(creatorTag){
    var res = await fetch(`/creator/made/${creatorTag}`);
    var json = await res.json();
    return json;
}

async function getCreators(){
    var res = await fetch('/creator/all-creators');
    var json = await res.json();
    return json;
}

export { getCreatorPosts, getWornByProducts, getMadeProducts, getCreators };