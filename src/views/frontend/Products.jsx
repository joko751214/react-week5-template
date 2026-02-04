import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getPublicProducts } from '../../api/server/product';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const pageSize = 12;

  // 產品分類
  const categories = [
    { value: null, label: '全部商品', icon: '🐾' },
    { value: 'dog', label: '狗狗用品', icon: '🐕' },
    { value: 'cat', label: '貓咪用品', icon: '🐱' },
    { value: 'class', label: '寵物相關課程', icon: '🎯' },
    { value: 'supplies', label: '寵物周邊小物', icon: '🎾' },
  ];

  // 載入產品資料
  const loadProducts = async () => {
    console.log('loadProducts');
    try {
      setLoading(true);
      const response = await getPublicProducts({ category: selectedCategory, page: currentPage });

      let filteredProducts = response.data.products || [];

      // 搜尋篩選
      if (searchTerm) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      // 排序
      switch (sortBy) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          break;
      }

      setProducts(filteredProducts);
      console.log(filteredProducts.length, 'filteredProducts.length');
      filteredProducts.length < 10
        ? setTotalProducts(filteredProducts.length)
        : setTotalProducts(response.data.pagination?.total_pages * pageSize);
    } catch (error) {
      console.error('載入產品失敗:', error);
      message.error('載入產品失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [currentPage, selectedCategory, sortBy]);

  const handleSelectedCategory = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  // 搜尋處理
  const handleSearch = () => {
    setCurrentPage(1);
    loadProducts();
  };

  // 加入購物車
  const handleAddToCart = (product) => {
    message.success(`已將 ${product.title} 加入購物車`);
    // TODO: 實作購物車邏輯
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="載入中..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 搜尋和篩選區 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 搜尋框 */}
            <div className="col-span-1 md:col-span-2">
              <Input
                size="large"
                placeholder="搜尋商品名稱或描述..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onPressEnter={handleSearch}
                allowClear
                className="rounded-lg"
              />
            </div>

            {/* 排序選擇 */}
            <Select size="large" value={sortBy} onChange={setSortBy} className="w-full">
              <Option value="default">預設排序</Option>
              <Option value="price-low">價格：低到高</Option>
              <Option value="price-high">價格：高到低</Option>
              <Option value="name">名稱排序</Option>
            </Select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 側邊欄分類篩選 */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4 text-gray-800">商品分類</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => handleSelectedCategory(category.value)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                      selectedCategory === category.value
                        ? 'bg-linear-to-r from-orange-400 to-pink-400 text-white shadow-md transform scale-105'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <span className="font-medium">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* 產品網格 */}
          <main className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">沒有找到商品</h3>
                <p className="text-gray-500">請嘗試其他搜尋條件</p>
              </div>
            ) : (
              <>
                <div className="mb-6 text-gray-600">
                  找到 <span className="font-bold text-orange-500">{products.length}</span> 件商品
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                    >
                      {/* 產品圖片 */}
                      <Link to={`/product/${product.id}`} className="block relative group overflow-hidden">
                        <div className="aspect-square bg-gray-100">
                          <img
                            src={product.imageUrl || 'https://via.placeholder.com/400?text=No+Image'}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        {product.price < product.origin_price && (
                          <div className="absolute top-3 left-3 bg-linear-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            特價
                          </div>
                        )}
                      </Link>

                      {/* 產品資訊 */}
                      <div className="p-5">
                        <div className="mb-2">
                          <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold">
                            {categories.find((c) => c.value === product.category)?.label || '其他'}
                          </span>
                        </div>

                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-bold text-lg mb-2 text-gray-800 hover:text-orange-500 transition-colors line-clamp-2 min-h-14">
                            {product.title}
                          </h3>
                        </Link>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-10">
                          {product.description || '暫無描述'}
                        </p>

                        {/* 價格 */}
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-2xl font-bold text-orange-500">${product.price?.toLocaleString()}</span>
                          {product.origin_price > product.price && (
                            <span className="text-sm text-gray-400 line-through">
                              ${product.origin_price?.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* 星級評分 */}
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, index) => (
                            <span key={index} className="text-yellow-400 text-lg">
                              ★
                            </span>
                          ))}
                          <span className="text-gray-500 text-sm ml-2">(4.8)</span>
                        </div>

                        {/* 按鈕 */}
                        <div className="flex gap-2">
                          <Link
                            to={`/product/${product.id}`}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 px-4 rounded-lg font-medium transition-colors text-center"
                          >
                            查看詳情
                          </Link>
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.is_enabled}
                            className="flex-1 bg-linear-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white py-2.5 px-4 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
                            加入購物車
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 分頁 */}
                <div className="mt-12 flex justify-center">
                  <Pagination
                    current={currentPage}
                    total={totalProducts}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    className="custom-pagination"
                  />
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
