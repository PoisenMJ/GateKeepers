/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import Home from '../pages/Home';
import About from '../pages/About';
import HomeLayout from '../layouts/homeLayout';
import Login from '../pages/Login';

export default [
  {
    path: "/",
    element: <HomeLayout/>,
    children: [
      { index: true, element: <Home/> },
      { path: "home", element: <Home/> },
      { path: "about", element: <About/> },
      { path: "login", element: <Login/> }
    ]
  },
];