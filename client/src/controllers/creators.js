async function login(username, password) {
  const res = await fetch('/creator/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  const json = await res.json();
  return json;
}

async function addOutfit(username, token, name, items, image) {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('token', token);
  formData.append('name', name);
  formData.append('items', JSON.stringify(items));
  formData.append('outfitImg', image);
  console.log(...formData);

  const res = await fetch('/creator/outfit/create', {
    method: 'POST',
    body: formData,
  });
  const json = await res.json();
  return json;
}

async function deleteOutfit(username, token, outfitID) {
  const res = await fetch('/creator/outfit/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      token,
      outfitID,
    }),
  });
  const json = await res.json();
  return json;
}

async function getOutfits(username) {
  const res = await fetch(`/creator/outfit/all/${username}`);
  const json = await res.json();
  return json;
}

async function addProduct(formData, username, token, order, images, customSize, sizes) {
  const data = new FormData(formData);
  data.append('username', username);
  data.append('token', token);
  data.append('imageOrder', order);
  data.append('customSizeAccept', customSize);
  data.append('sizes', sizes);

  for (let i = 0; i < images.length; i += 1) {
    data.append('images', images[i]);
  }

  const moneyInput = data.get('price').split(',').join('');
  data.set('price', moneyInput);
  const uri = data.get('name').toLowerCase().replace(' ', '_').concat('_')
    .concat(username);
  data.append('uri', uri);

  const res = await fetch('/creator/products/add', {
    method: 'POST',
    body: data,
  });
  const json = await res.json();
  return json;
}

async function getOrders(username, token) {
  const res = await fetch('/creator/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, token }),
  });
  const json = await res.json();
  return json;
}

async function removeProduct(productID, username, token) {
  const res = await fetch('/creator/products/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productID, username, token }),
  });
  const json = await res.json();
  return json;
}

async function markOrderSent(orderID, username, token) {
  const res = await fetch('/creator/orders/mark-sent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      token,
      orderID,
    }),
  });
  const json = await res.json();
  return json;
}

async function updateProduct(formData, username, token) {
  formData.append('token', token);
  formData.append('username', username);
  const res = await fetch('/creator/products/update', {
    method: 'POST',
    body: formData,
  });
  const json = await res.json();
  return json;
}

async function getProduct(productID, username, token) {
  const res = await fetch(`/creator/products/${productID}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, username, productID }),
  });
  const json = await res.json();
  return json;
}

async function getProducts(username, token) {
  const res = await fetch(`/creator/products/all/${username}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, username }),
  });
  const json = await res.json();
  return json;
}

async function getGatekeeper(username, token) {
  const res = await fetch(`/creator/${username}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, username }),
  });
  const json = await res.json();
  return json;
}

// TODO:need token
async function updateGatekeeper(data, username) {
  const res = await fetch(`/creator/update/${username}`, {
    method: 'POST',
    body: data,
  });
  const json = await res.json();
  return json;
}

async function getGatekeeperCustomsMessages(username, token) {
  const res = await fetch('/creator/custom/all', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      token,
    }),
  });
  const json = await res.json();
  return json;
}

async function acceptGatekeeperCustom(username, token, user) {
  const res = await fetch('/creator/custom/accept', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      token,
      user,
    }),
  });
  const json = await res.json();
  return json;
}

async function declineGatekeeperCustom(username, token, user) {
  const res = await fetch('/creator/custom/decline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      token,
      user,
    }),
  });
  const json = await res.json();
  return json;
}

async function sendCustomsMessage(username, token, message, to, type) {
  const res = await fetch('/creator/custom/send-message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      token,
      message,
      to,
      type,
    }),
  });
  const json = await res.json();
  return json;
}

async function markReadCustomsChat(username, token, to) {
  const res = await fetch('/creator/custom/read', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      token,
      to,
    }),
  });
  const json = await res.json();
  return json;
}

async function hasCustomsOn(username) {
  const res = await fetch(`/creator/custom/check?username=${username}`);
  const json = await res.json();
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
  hasCustomsOn,
};
