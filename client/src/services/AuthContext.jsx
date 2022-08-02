import React, { useState, useMemo } from 'react';

const tokenName = 'gatek33pers_token';
const sessionName = 'gatek33pers_session';

/* eslint-disable no-unused-vars */
const AuthContext = React.createContext({
  token: null,
  session: null,
  onSignIn: (_data) => {},
  onSignOut: () => {}
});

// eslint-disable-next-line react/prop-types
function AuthProvider({ children }) {
  const localToken = localStorage.getItem(tokenName);
  const localSession = JSON.parse(localStorage.getItem(sessionName));

  const [token, setToken] = useState(localToken);
  const [session, setSession] = useState(localSession);

  function onSignIn(_data) {
    if(_data.user && _data.token) {
      /*
      * Store token and session (in stringified json format)
      * in local storage to maintain state between refreshes etc.
      */      
      localStorage.setItem(tokenName, _data.token);
      localStorage.setItem(sessionName, JSON.stringify(_data.user))
      setToken(_data.token);
      setSession(JSON.stringify(_data.user));
      return true;
    } return false;
  }

  function onSignOut() {

  }

  return (
    <AuthContext.Provider value={useMemo(() => ({
      token,
      session,
      onSignIn,
      onSignOut
    }), [])}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
