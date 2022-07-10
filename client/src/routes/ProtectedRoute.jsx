import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { Navigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { checkToken } from '../services/auth';

function ProtectedRoute() {
  const [auth, setAuth] = useState(false);
  // const [isCreator, setCreator] = useState(false);
  const [isTokenValidated, setIsTokenValidated] = useState(false);

  useEffect(() => {
    checkToken().then((result) => {
      if (result) {
        setAuth(true);
      }
      // if (result.message) setCreator(true);
    }).then(() => {
      setIsTokenValidated(true);
    });
  }, []);

  if (!isTokenValidated) {
    return (
      <div className="loading">
        <Spinner animation="border" role="status" size="sm">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    (auth) ? <Outlet /> : <Navigate to="/login" />
  );
}

export default ProtectedRoute;
