import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { LogOut } from './auth';
import { DEVELOPMENT } from '../config';

/* eslint-disable no-unused-vars */
const AuthContext = React.createContext({
  token: null,
  setToken: (data) => { },
  username: null,
  setUsername: (data) => { },
  loggedIn: null,
  setLoggedIn: (_data) => { },
});
/* eslint-enable no-unused-vars */

// eslint-disable-next-line react/prop-types
function AuthProvider({ children }) {
  const localLoggedIn = JSON.parse(localStorage.getItem('auth')) || false;
  const localToken = localStorage.getItem('token') || null;
  const localUsername = localStorage.getItem('username') || '';

  const [token, setToken] = useState(localToken);
  const [username, setUsername] = useState(localUsername);
  const [loggedIn, setLoggedIn] = useState(localLoggedIn);

  useEffect(() => {
    localStorage.setItem('auth', loggedIn);
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
  }, [token, username, loggedIn]);

  return (
    <AuthContext.Provider value={useMemo(() => ({
      loggedIn,
      token,
      username,
      setLoggedIn,
      setToken,
      setUsername,
    }), [])}
    >
      {children}
    </AuthContext.Provider>
  );
}

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (err) {
    return null;
  }
};

function AuthVerify() {
  const navigate = useNavigate();
  const {
    username, token, loggedIn,
    setUsername, setToken, setLoggedIn,
  } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    if (username && token && loggedIn) {
      const decodedJwt = parseJwt(token);
      if (decodedJwt.exp * 1000 < Date.now()) {
        setUsername(null);
        setToken(null);
        setLoggedIn(false);
        LogOut();
      } else {
        const creator = localStorage.getItem('creator') === true;

        if (!DEVELOPMENT) {
          const subdoamins = location.hostname.split('.');
          if (subdoamins[0] !== 'creators' && creator) navigate('/creators/login');
          else if (subdoamins[0] === 'creators' && !creator) navigate('/');
        }
        // console.log('VALID');
      }
    } else {
      setUsername(null);
      setToken(null);
      setLoggedIn(false);
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('auth');
      localStorage.removeItem('creator');
    }
  }, [location]);

  return <div />;
}

export { AuthProvider, AuthContext, AuthVerify };
