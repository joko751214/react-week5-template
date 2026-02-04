import { Layout } from '../views/frontend/layout/Home';
import { Home } from '../views/frontend/Homepage';
import { Products } from '../views/frontend/Products';
import { Product } from '../views/frontend/Product';
import { Cart } from '../views/frontend/Cart';
import { Dashboard } from '../views/backend/layout/Dashboard';
import { ManageProducts } from '../views/backend/ManageProducts';
import { Login } from '../views/backend/Login';

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'products',
        element: <Products />,
      },
      {
        path: 'product/:id',
        element: <Product />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
    ],
  },
  {
    path: '/admin',
    element: <Dashboard />,
    children: [
      {
        path: '',
        element: <ManageProducts />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
];
