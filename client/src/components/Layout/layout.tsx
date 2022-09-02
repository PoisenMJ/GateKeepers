import React from 'react';
import { Outlet } from 'react-router';
import FlashMessage from '../FlashMessage';

const Layout = () => {
  return (
    <div>
      <Outlet/>
      <FlashMessage/>
    </div>
  )
};

export default Layout;