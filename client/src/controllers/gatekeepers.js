async function getGatekeeperPosts() {
  const res = await fetch('/gatekeeper/all-posts');
  const json = await res.json();
  return json;
}

async function getShop(gatekeeperTag) {
  const res = await fetch(`/gatekeeper/shop/${gatekeeperTag}`);
  const json = await res.json();
  return json;
}

async function getGatekeepers() {
  const res = await fetch('/gatekeeper/all-gatekeepers');
  const json = await res.json();
  return json;
}

async function getGatekeeper(gatekeeperTag) {
  const res = await fetch(`/gatekeeper/${gatekeeperTag}`);
  const json = await res.json();
  return json;
}

async function getProduct(gatekeeperTag, productURI) {
  const res = await fetch(`/gatekeeper/shop/${gatekeeperTag}/${productURI}`);
  const json = await res.json();
  return json;
}

async function getGatekeeperShippingCountries(creatorTag) {
  const res = await fetch(`/gatekeeper/shipping/${creatorTag}`);
  const json = await res.json();
  return json;
}

async function getGatekeeperAccentColor(creatorTag) {
  const res = await fetch(`/gatekeeper/accent/${creatorTag}`);
  const json = await res.json();
  return json;
}

export {
  getGatekeeperPosts,
  getGatekeepers,
  getGatekeeper,
  getProduct,
  getGatekeeperShippingCountries,
  getGatekeeperAccentColor,
  getShop
};
