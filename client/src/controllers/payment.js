async function getCheckoutUrl(products, username, shippingPrice, email) {
  const res = await fetch('/payment/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      products, username, shippingPrice, email,
    }),
  });
  const json = await res.json();
  return json.url;
}

async function getSessionData(sessionID, username) {
  const res = await fetch('/payment/session-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionID, username }),
  });
  const json = await res.json();
  return json;
}

async function checkProduct(urisAndNames) {
  const res = await fetch('/payment/check-products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: urisAndNames }),
  });
  const json = await res.json();
  return { outOfStock: json.outOfStock, name: json.name };
}

async function saveOrder(customerID, orderID, items, total, subTotal, username, shippingAddress, creators) {
  const res = await fetch('/payment/save-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderID,
      customerID,
      shippingAddress,
      items,
      subTotal,
      username,
      date: new Date(),
      total,
      creators,
    }),
  });
  const json = await res.json();
  return json;
}

async function cancelOrder(items) {
  const res = await fetch('/payment/cancel-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  const json = await res.json();
  return json;
}

async function sendConfirmationEmail(sessionID, email, items, total) {
  const res = await fetch('/payment/send-confirmation-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionID,
      email,
      items,
      total,
    }),
  });
  const json = await res.json();
  return json;
}

export {
  getCheckoutUrl, getSessionData, saveOrder, checkProduct, cancelOrder, sendConfirmationEmail,
};
