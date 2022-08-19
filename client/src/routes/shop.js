/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { ShopLayout } from '../layouts';
import Shop from '../pages/Shop';

export default [
  {
    path: "/:gatekeeper",
    element: <ShopLayout/>,
    children: [
      { index: true, element: <Shop/> },
      { path: "shop", element: <Shop/> }
    ]
  }
]