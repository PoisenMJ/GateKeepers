async function login(username, password) {
  const urlencoded = new URLSearchParams();
  urlencoded.append('username', username);
  urlencoded.append('password', password);

  const res = await fetch('/auth/login', {
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: urlencoded,
  });
  const json = await res.json();
  return json;
}

async function createAccount(username, email, password) {
  const urlencoded = new URLSearchParams();
  urlencoded.append('username', username);
  urlencoded.append('email', email);
  urlencoded.append('password', password);
  const res = await fetch('/auth/create-account', {
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: urlencoded,
  });
  const json = await res.json();
  return json;
}

// TODO: check if local storage available
function saveUser(token, username) {
  localStorage.setItem('username', username);
  localStorage.setItem('token', token);
}

export { login, createAccount, saveUser };
