import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../services/AuthContext';
import { LogOut } from '../services/auth';
import { DEVELOPMENT } from '../config';

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (err) {
    return null;
  }
};

const useAuthCheck = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    username, token, loggedIn,
    setUsername, setToken, setLoggedIn,
  } = useContext(AuthContext);

  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (username && token && loggedIn) {
      const decodedJwt = parseJwt(token);
      if (decodedJwt.exp * 1000 < Date.now()) {
        setAuthenticated(false);
        setUsername(null);
        setToken(null);
        setLoggedIn(false);
        LogOut();
      } else {
        const creator = localStorage.getItem('creator') === true;
        setAuthenticated(true);
        /* IF PROD AND CREATOR SET TO TRUE 
         * THEN KEEP IN CREATOR. SUBDOMAIN
         */
        if (!DEVELOPMENT) {
          const subdoamins = location.hostname.split('.');
          if (subdoamins[0] !== 'creators' && creator) navigate('/creators/login');
          else if (subdoamins[0] === 'creators' && !creator) navigate('/');
        }
      }
    } else {
      setAuthenticated(false);
      setUsername(null);
      setToken(null);
      setLoggedIn(false);
      LogOut();
    }
  }, [location]);

  return authenticated;
}

export default useAuthCheck;