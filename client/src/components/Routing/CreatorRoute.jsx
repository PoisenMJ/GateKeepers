/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, Route } from 'react-router';
import PropTypes from 'prop-types';
import Loading from '../Loading';
import { checkCreatorToken } from '../../services/auth';

function CreatorRoute({ component: Component, path, ...rest }) {
  const [isCreator, setIsCreator] = useState(false);
  const [isTokenValidated, setIsTokenValidated] = useState(false);

  useEffect(() => {
    checkCreatorToken().then((result) => {
      if(result) setIsCreator(true);
      else setIsCreator(false);
    }).then(() => setIsTokenValidated(true));
  }, []);

  if(!isTokenValidated) return <Loading/>
  return (isCreator) ? (
    <Route path={path}>
      {Component ?
        <Component {...rest}/>:
        <Outlet/>
      }
    </Route>
  ) : <Navigate to="/creators/login"/>
};

CreatorRoute.propTypes = {
  component: PropTypes.arrayOf(PropTypes.element),
  path: PropTypes.string.isRequired
}

CreatorRoute.defaultProps = {
  component: []
};

export default CreatorRoute;