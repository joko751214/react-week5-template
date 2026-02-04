import { message } from 'antd';
import {
  getCartList,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  deleteCartItem as apiDeleteCartItem,
} from '@/api/server/cart';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = async () => {
    try {
      const {
        data: { data },
      } = await getCartList();
      const carts = data?.carts || [];
      const count = carts.length;
      setCartCount(count);
    } catch (err) {
      console.error('refreshCartCount error', err);
    }
  };

  useEffect(() => {
    refreshCartCount();
  }, []);

  const addToCart = async (payload) => {
    try {
      await apiAddToCart(payload);
      message.success('已加入購物車');
      await refreshCartCount();
    } catch (err) {
      console.error(err);
      message.error('加入購物車失敗');
      throw err;
    }
  };

  const updateCart = async (id, data) => {
    try {
      await apiUpdateCartItem(id, data);
      await refreshCartCount();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const removeFromCart = async (id) => {
    try {
      await apiDeleteCartItem(id);
      await refreshCartCount();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount, addToCart, updateCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
