import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { Navigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { checkCreatorToken } from '../services/auth';

function NonCreatorRoute() {
  const [isCreator, setIsCreator] = useState(false);
  const [isTokenValidated, setIsTokenValidated] = useState(false);

  useEffect(() => {
    checkCreatorToken().then((result) => {
      if (result) {
        setIsCreator(true);
      }
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
    (!isCreator) ? <Outlet /> : <Navigate to="/creators" />
  );
}

export default NonCreatorRoute;
