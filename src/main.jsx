import { createRoot } from 'react-dom/client';
import './styles/all.css';
import { createHashRouter, RouterProvider } from 'react-router';
import { routes } from './router/index.jsx';

const router = createHashRouter(routes);

createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
