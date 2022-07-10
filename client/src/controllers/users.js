async function recoverPassword(username, token, newPassword) {
  const res = await fetch('/user/recover-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      token,
      newPassword,
    }),
  });
  const json = await res.json();
  return json;
}

async function changePassword(username, token, newPassword, updateToken) {
  const res = await fetch('/user/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      token,
      newPassword,
      updateToken,
    }),
  });
  const json = await res.json();
  return json;
}

async function sendRecoveryEmail(email) {
  const res = await fetch('/user/get-reset-password-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
    }),
  });
  const json = await res.json();
  return json;
}

async function sendPasswordChangeEmail(username, token) {
  const res = await fetch('/user/email-change-password', {
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

async function getActivationToken(username) {
  const res = await fetch('/user/get-activation-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
    }),
  });
  const json = await res.json();
  return json;
}

async function submitActivationToken(activationToken, username) {
  const res = await fetch('/user/check-activation-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      activationToken,
    }),
  });
  const json = await res.json();
  return json;
}

async function getOrders(username, token) {
  const res = await fetch('/user/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token,
      username,
    }),
  });
  const json = await res.json();
  return json;
}

async function getProfile(username, token) {
  const res = await fetch('/user/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token,
      username,
    }),
  });
  const json = await res.json();
  if (json.success) {
    const data = await getOrders(username, token);
    if (data.orders) {
      return { profile: json.user, orders: data.orders, success: true };
    } return { success: false };
  }
  return { success: false };
}

async function sendCustomRequest(username, token, description, price, gatekeeper) {
  const res = await fetch('/user/custom/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      token,
      description,
      price,
      gatekeeper,
    }),
  });
  const json = await res.json();
  return json;
}

async function getUserCustom(username, token, gatekeeper) {
  const res = await fetch(`/user/custom/${gatekeeper}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, token }),
  });
  const json = await res.json();
  return json;
}

async function sendCustomsMessage(username, token, message, gatekeeper) {
  const res = await fetch('/user/custom/send-message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      token,
      message,
      gatekeeper,
    }),
  });
  const json = await res.json();
  return json;
}

async function fetchAllCustomsMessages(username, token, gatekeeper) {
  const res = await fetch('/user/custom/all-messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      token,
      gatekeeper,
    }),
  });
  const json = await res.json();
  return json;
}

export {
  getProfile,
  getActivationToken,
  submitActivationToken,
  recoverPassword,
  sendRecoveryEmail,
  sendPasswordChangeEmail,
  changePassword,
  sendCustomRequest,
  getUserCustom,
  sendCustomsMessage,
  fetchAllCustomsMessages,
};
