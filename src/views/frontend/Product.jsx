import { useParams, Link } from 'react-router';
import { getPublicProduct } from '@/api/server/products';
import { useCart } from '@/context/CartContext';

export const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await getPublicProduct(id);
      setProduct(res.data.product);
    } catch (err) {
      console.error(err);
      message.error('載入商品失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  const { addToCart } = useCart();
  const handleAddToCart = async () => {
    if (!product) return;
    try {
      const data = { product_id: product.id, qty: 1 };
      await addToCart({ data });
    } catch (err) {
      // 錯誤訊息在 context 已處理
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="載入中..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-bold">找不到商品</h3>
        <p className="text-gray-500">請確認商品是否存在或返回商品列表</p>
        <div className="mt-6">
          <Link to="/products" className="text-orange-500 hover:underline">
            返回商品列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={product.imageUrl || 'https://via.placeholder.com/600?text=No+Image'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
                <div className="mb-3">
                  <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {product.category || '其他'}
                  </span>
                </div>
                <p className="text-gray-600 mb-6 line-clamp-3">{product.description || '暫無描述'}</p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold text-orange-500">${product.price?.toLocaleString()}</div>
                {product.origin_price > product.price && (
                  <div className="text-sm text-gray-400 line-through">${product.origin_price?.toLocaleString()}</div>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                type="button"
                onClick={() => handleAddToCart()}
                disabled={!product.is_enabled}
                className="cart-btn"
              >
                加入購物車
              </button>

              <Link to="/products" className="py-3 px-6 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800">
                回到列表
              </Link>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">商品詳情</h3>
              <div className="prose max-w-none text-gray-700">
                {product.content || product.description || '此商品尚無額外內容'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
