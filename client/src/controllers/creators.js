async function getCreatorPosts() {
  const res = await fetch('/creator/all-posts');
  const json = await res.json();
  return json;
}

async function getOwnProducts(creatorTag) {
  const res = await fetch(`/creator/products/own/${creatorTag}`);
  const json = await res.json();
  return json;
}

async function getMadeProducts(creatorTag) {
  const res = await fetch(`/creator/products/made/${creatorTag}`);
  const json = await res.json();
  return json;
}

async function getCreators() {
  const res = await fetch('/creator/all-creators');
  const json = await res.json();
  return json;
}

async function getCreator(creatorTag) {
  const res = await fetch(`/creator/${creatorTag}`);
  const json = await res.json();
  return json;
}

async function getProduct(productURI, type) {
  const res = await fetch(`/creator/products/${productURI}/${type}`);
  const json = await res.json();
  return json;
}

async function getCreatorShippingCountries(creatorTag) {
  const res = await fetch(`/creator/shipping/${creatorTag}`);
  const json = await res.json();
  return json;
}

async function getCreatorAccentColor(creatorTag) {
  const res = await fetch(`/creator/accent/${creatorTag}`);
  const json = await res.json();
  return json;
}

export {
  getCreatorPosts,
  getOwnProducts,
  getMadeProducts,
  getCreators,
  getCreator,
  getProduct,
  getCreatorShippingCountries,
  getCreatorAccentColor,
};
