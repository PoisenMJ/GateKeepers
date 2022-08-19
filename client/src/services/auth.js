const creatorName = "gatek33pers_creator";
// TODO: if its httponly cookie check that instead

function checkTokenExpiration() {}

function checkToken() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  return fetch("/auth/check-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, username }),
  })
    .then((raw) => raw.json())
    .then((json) => {
      if (json.success) return true;

      // console.log("DELETING TOKENS");
      // // TODO: abstract token writing and deleting
      // localStorage.removeItem('token');
      // localStorage.removeItem('username');
      return false;
    });
}

function checkCreatorTokenExists() {
  return localStorage.getItem(creatorName) === "true";
}

function setCreatorToken(val) {
  localStorage.setItem(creatorName, val);
}

async function checkCreatorToken() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  return fetch("/auth/check-creator-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, username }),
  })
    .then((raw) => raw.json())
    .then((json) => {
      if (json.success) return true;

      // console.log("DELETING CREATOR TOKEN");
      // localStorage.removeItem('token');
      // localStorage.removeItem('username');
      return false;
    });
}

// (username) (type: 'user': 'creator')
async function instagramLogin(username, type) {
  return fetch("/auth/instagram-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, type }),
  })
    .then((raw) => raw.json())
    .then((json) => {
      if (json.success) {
        return { token: json.token, type: json.type };
      }
      return false;
    });
}

function LogOut() {
  localStorage.removeItem("gatek33pers_token");
  localStorage.removeItem("gatek33pers_session");
  localStorage.removeItem("gatek33pers_creator");
  localStorage.removeItem("cart");
  localStorage.removeItem("cartTotal");
  localStorage.removeItem("creator");
}

export {
  checkTokenExpiration,
  checkToken,
  checkCreatorToken,
  LogOut,
  instagramLogin,
  checkCreatorTokenExists,
  setCreatorToken,
};
