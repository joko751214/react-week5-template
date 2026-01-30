import { createRoot } from 'react-dom/client';
import './styles/all.scss';
import { createHashRouter, RouterProvider } from 'react-router';
import { routes } from './router/index.jsx';
import 'antd/dist/reset.css';

const router = createHashRouter(routes);

createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
