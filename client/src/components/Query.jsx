/* eslint-disable react/prop-types */
import React from 'react';
import MediaQuery from 'react-responsive';

function Mobile({ children }) {
  return (
    <MediaQuery maxWidth={1224}>
      {children}
    </MediaQuery>
  );
}

function Desktop({ children }) {
  return (
    <MediaQuery minWidth={1224}>
      {children}
    </MediaQuery>
  );
}

function CartMobileBreakpoint({ children }) {
  return (
    <MediaQuery maxWidth={600}>
      {children}
    </MediaQuery>
  );
}

function CartDesktopBreakpoint({ children }) {
  return (
    <MediaQuery minWidth={600}>
      {children}
    </MediaQuery>
  );
}

export {
  Mobile, Desktop,
  CartDesktopBreakpoint, CartMobileBreakpoint,
};
