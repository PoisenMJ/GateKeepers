import React from 'react';
import { useRoutes } from "react-router";
import Basket from '../pages/Basket';
import Checkout from '../pages/Checkout';
import FAQ from '../pages/FAQ';

import Home from "../pages/Home";
import Login from '../pages/Login';
import Orders from '../pages/Orders';
import Product from '../pages/Product';
import Profile from '../pages/Profile';
import Shop from '../pages/Shop';
import SignUp from '../pages/SignUp';

// eslint-disable-next-line react-hooks/rules-of-hooks
const routes = () => useRoutes([
  {
    path: "/",
    index: true,
    element: <Home/>
  },
  {
    path: "/home",
    element: <Home/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/sign-up",
    element: <SignUp/>
  },
  {
    path: "/shop",
    element: <Shop/>
  },
  {
    path: "/shop/:productName",
    element: <Product/>
  },
  {
    path: "/basket",
    element: <Basket/>
  },
  {
    path: "/checkout",
    element: <Checkout/>
  },
  {
    path: "/profile",
    element: <Profile/>
  },
  {
    path: "/orders",
    element: <Orders/>
  },
  {
    path: "/faq",
    element: <FAQ/>
  }
]);

export default routes;