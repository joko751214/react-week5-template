import { Link, Outlet } from 'react-router';
import { useState } from 'react';

export const Layout = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery('');
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-linear-to-r from-orange-400 to-pink-400 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="text-3xl">🐾</div>
              <div className="font-bold text-xl">PetShop</div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-white/90">
            <Link to="/" className="hover:underline">
              首頁
            </Link>
            <Link to="/products" className="hover:underline">
              商品列表
            </Link>
            <Link to="/cart" className="hover:underline">
              購物車
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center">
              <input
                className="px-3 py-2 rounded-lg text-gray-700 w-48 focus:outline-none"
                placeholder="搜尋商品..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>

            <Link to="/cart" className="relative">
              <div className="bg-white/20 px-3 py-2 rounded-lg hover:bg-white/30">🛒</div>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">3</span>
            </Link>
          </div>
        </div>
      </header>
      {/* 頁面橫幅 */}
      <div className="bg-linear-to-r from-orange-400 to-pink-400 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">🐾 寵物周邊商城</h1>
          <p className="text-xl opacity-90">為您的毛孩挑選最優質的商品</p>
        </div>
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-linear-to-r from-orange-400 to-pink-400 mt-8 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm  flex flex-col md:flex-row justify-between items-center gap-2">
          <div>© {new Date().getFullYear()} PetShop — 為毛孩挑選最好的商品</div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:underline">
              關於我們
            </Link>
            <Link to="/contact" className="hover:underline">
              聯絡我們
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
