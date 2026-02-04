import { Link } from 'react-router';
import { getCartList, updateCartItem, deleteCartItem } from '@/api/server/cart';
import { useCart } from '@/context/CartContext';

export const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshCartCount } = useCart();

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await getCartList();
      // 兼容不同後端回傳格式
      const carts = res.data?.data?.carts || res.data?.carts || res.data?.cart || [];
      // 將後端欄位轉成前端需要的格式
      const mapped = carts.map((c) => ({
        id: c.id || c.product_id || c.id_cart,
        title: c.product?.title || c.title || c.name || c.product_name,
        price: c.product?.price || c.price || c.unit_price || 0,
        qty: c.qty || c.quantity || c.count || 1,
        imageUrl: c.product?.imageUrl || c.imageUrl || c.product?.image || '',
        raw: c,
      }));
      setItems(mapped);
      // 同步更新 header 的購物車數量
      refreshCartCount && refreshCartCount();
    } catch (err) {
      console.error(err);
      message.error('載入購物車失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const changeQty = async (item, qty) => {
    const newQty = Math.max(1, qty);
    try {
      await updateCartItem(item.id, { product_id: item.raw.product_id, qty: newQty });
      message.success('已更新數量');
      await loadCart();
    } catch (err) {
      console.error(err);
      message.error('更新數量失敗');
    }
  };

  const handleRemove = async (item) => {
    try {
      await deleteCartItem(item.id);
      message.success('已刪除項目');
      await loadCart();
    } catch (err) {
      console.error(err);
      message.error('刪除失敗');
    }
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 120;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">購物車</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-4">🛒</div>
                <div className="text-lg font-semibold">您的購物車是空的</div>
                <div className="mt-4">
                  <Link to="/products" className="text-orange-500 hover:underline">
                    去逛逛商品
                  </Link>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.imageUrl || 'https://via.placeholder.com/200?text=No+Image'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-lg">{item.title}</div>
                        <div className="text-gray-500 text-sm mt-1">NT${item.price.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-orange-500">
                          NT${(item.price * item.qty).toLocaleString()}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          className="text-sm text-gray-400 hover:text-red-500 mt-2 cursor-pointer"
                        >
                          刪除
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex items-center border rounded-lg">
                        <button type="button" onClick={() => changeQty(item, item.qty - 1)} className="px-3 py-1">
                          -
                        </button>
                        <div className="px-4">{item.qty}</div>
                        <button type="button" onClick={() => changeQty(item, item.qty + 1)} className="px-3 py-1">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <aside>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">訂單摘要</h2>
            <div className="flex justify-between text-gray-600 mb-2">
              <div>小計</div>
              <div>NT${subtotal.toLocaleString()}</div>
            </div>
            <div className="flex justify-between text-gray-600 mb-2">
              <div>運費</div>
              <div>{shipping === 0 ? '免運' : `NT${shipping}`}</div>
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between items-center">
              <div className="text-lg font-bold">總計</div>
              <div className="text-2xl font-bold text-orange-500">NT${total.toLocaleString()}</div>
            </div>

            <button type="button" className="mt-6 w-full cart-btn">
              前往結帳
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
