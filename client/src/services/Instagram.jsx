import React, { useContext, useEffect } from 'react';

import { useNavigate } from 'react-router';
import { Flash } from '../components/FlashMessage/FlashMessage';
import { instagramLogin } from './auth';
import { AuthContext } from './AuthContext';

import { APP_ID, APP_REDIRECT, APP_SECRET } from '../config';

function Instagram() {
  const navigate = useNavigate();
  const { setUsername, setToken, setLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    const initializeLogin = async () => {
      // fetch token from code
      const data = new URLSearchParams();
      data.append('client_id', APP_ID);
      data.append('client_secret', APP_SECRET);
      data.append('code', code);
      data.append('grant_type', 'authorization_code');
      data.append('redirect_uri', APP_REDIRECT);

      const response = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        body: data,
      });
      const json1 = await response.json();

      // use token to fetch profile
      if (json1.access_token) {
        const { accessToken } = json1;
        const res = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
        const json2 = await res.json();
        if (json2.username) {
          const instaResponse = await instagramLogin(json2.username, state);
          if (instaResponse.type === 'user') {
            setUsername(json2.username);
            setToken(response.token);
            setLoggedIn(true);
            navigate('/');
          } else if (instaResponse.type === 'creator') {
            setUsername(json2.username);
            setToken(instaResponse.token);
            setLoggedIn(true);
            localStorage.setItem('creator', true);
            navigate('/creators/orders');
          } else {
            Flash('Invalid instagram profile', 'dark');
            navigate('/login');
          }
        }
      }
    };
    initializeLogin();
  }, []);

  return (
    <>
    </>
  );
}

export default Instagram;
