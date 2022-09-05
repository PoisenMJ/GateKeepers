import Shop from '../pages/Shop';
import Product from '../pages/Product';
import { RouteObject } from 'react-router';

const shopRoutes: RouteObject[] = [
  {
    path: "/shop",
    element: <Shop/>
  },
  {
    path: "/shop/:productName",
    element: <Product/>
  },
];

export default shopRoutes;