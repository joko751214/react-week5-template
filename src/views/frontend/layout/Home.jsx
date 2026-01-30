import { Link } from 'react-router';
import { Outlet } from 'react-router';

export const Layout = () => {
  return (
    <>
      <header>
        <nav className="mt-5">
          <Link className="h4 mt-5 mx-2" to="/">
            首頁
          </Link>
          <Link className="h4 mt-5 mx-2" to="/products">
            產品頁面
          </Link>
          <Link className="h4 mt-5 mx-2" to="/cart">
            購物車頁面
          </Link>
        </nav>
      </header>
      <Outlet />
    </>
  );
};
