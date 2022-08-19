import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { Navigate } from 'react-router-dom';
import Loading from '../components/Loading';

import { checkCreatorToken } from '../services/auth';

function CreatorRoute() {
  const [isCreator, setIsCreator] = useState(false);
  const [isTokenValidated, setIsTokenValidated] = useState(false);

  useEffect(() => {
    checkCreatorToken().then((result) => {
      if (result) {
        setIsCreator(true);
      } else {
        setIsCreator(false);
      }
    }).then(() => {
      setIsTokenValidated(true);
    });
  }, []);

  if (!isTokenValidated) return ( <Loading/> );
  return (isCreator) ? <Outlet /> : <Navigate to="/creators/login" />
}

export default CreatorRoute;
