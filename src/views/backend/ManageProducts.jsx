import { useNavigate } from 'react-router';
import { getProducts, editProduct, addProduct } from '@/api/server/product';
import { checkLogin } from '@/api/server/login';
import Pagination from '@/component/Pagination';
import ProductModal from '@/component/ProductModal';
import TipsModal from '@/component/TipsModal';
import Toasts from '@/component/Toasts';

export const ManageProducts = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  // 檢查是否為管理員
  const checkAdmin = async () => {
    try {
      setIsLoading(true);
      await checkLogin();
    } catch (err) {
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  const [products, setProducts] = useState([]);
  // 取得產品列表
  const handleGetProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await getProducts({
        page: pagination.current_page || 1,
      });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const [pagination, setPagination] = useState({});
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
  };

  useEffect(() => {
    handleGetProducts();
  }, [pagination.current_page]);

  // 按鈕載入中狀態
  const [btnLoading, setBtnLoading] = useState({});
  const withBtnLoading = async (key, callback) => {
    setBtnLoading((prev) => ({ ...prev, [key]: true }));
    try {
      await callback();
    } finally {
      setBtnLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const originProduct = {
    title: '',
    category: '',
    origin_price: '',
    price: '',
    unit: '',
    description: '',
    content: '',
    is_enabled: 0,
    imageUrl: '',
    imagesUrl: [],
  };
  const [product, setProduct] = useState({ ...originProduct });
  const productModalRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  // 開啟 Modal（新增或編輯）
  const handleOpenModal = (productData = null) => {
    if (productData) {
      // 編輯模式
      setProduct({ ...productData, imagesUrl: productData.imagesUrl || [] });
      setIsEditing(true);
    } else {
      // 新增模式
      setProduct({ ...originProduct });
      setIsEditing(false);
    }
    productModalRef.current.show();
  };

  const toastRef = useRef(null);
  const [toastMesage, setToastMessage] = useState('');
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  // 新增或編輯產品
  const handleProductAction = async (productData, isEditing) => {
    await withBtnLoading('productAction', async () => {
      try {
        if (isEditing) {
          await editProduct(productData);
        } else {
          await addProduct(productData);
        }
        const message = isEditing ? '編輯成功' : '新增成功';
        setToastMessage(message);
        setIsErrorMessage(false);
        toastRef.current.show();
        setTimeout(() => {
          productModalRef.current.hide();
        }, 500);
        handleGetProducts();
      } catch (error) {
        setToastMessage(error.response.data.message.join(' ') || '操作失敗');
        setIsErrorMessage(true);
        toastRef.current.show();
      }
    });
  };

  const tipsRef = useRef(null);
  const [deleteItemTitle, seetDeleteItemTitle] = useState('');
  const handleOpenTipsModal = (productData) => {
    seetDeleteItemTitle(productData.title);
    tipsRef.current.show();
  };

  // 刪除產品
  const handleDeleteProduct = async (id) => {
    await withBtnLoading(`delete_${id}`, async () => {
      try {
        await deleteProduct(id);
        setToastMessage('刪除成功');
        setIsErrorMessage(false);
        toastRef.current.show();
        handleGetProducts();
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
    <>
      {isLoading ? (
        <div className="spinner-container">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="container">
            <Button type="primary">Button</Button>
            <div className="text-end mt-4">
              <button type="button" className="btn btn-primary" onClick={() => handleOpenModal()}>
                建立新的產品
              </button>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th width="120">分類</th>
                  <th>產品名稱</th>
                  <th width="120">原價</th>
                  <th width="120">售價</th>
                  <th width="100">是否啟用</th>
                  <th width="150">編輯</th>
                </tr>
              </thead>
              <tbody>
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.category}</td>
                      <td>{product.title}</td>
                      <td className="text-center">{product.origin_price}</td>
                      <td className="text-center">{product.price}</td>
                      <td>{product.is_enabled ? <span className="text-success">啟用</span> : <span>未啟用</span>}</td>
                      <td>
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleOpenModal(product)}
                            disabled={btnLoading[`delete_${product.id}`]}
                          >
                            編輯
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleOpenTipsModal(product)}
                            disabled={btnLoading[`delete_${product.id}`]}
                          >
                            {btnLoading[`delete_${product.id}`] && (
                              <span
                                className="spinner-border spinner-border-sm me-1"
                                role="status"
                                aria-hidden="true"
                              ></span>
                            )}
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">尚無產品資料</td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* 分頁 */}
            {pagination.total_pages > 0 && <Pagination pagination={pagination} onPageChange={handlePageChange} />}
          </div>
        </div>
      )}
      {/* 新增產品 Modal */}
      <ProductModal
        modalRef={productModalRef}
        product={product}
        onProductChange={setProduct}
        isLoading={btnLoading.productAction}
        isEditing={isEditing}
        onAction={handleProductAction}
      />

      {/* 刪除產品 Modal */}
      <TipsModal
        modalRef={tipsRef}
        title={`是否要刪除「${deleteItemTitle}」`}
        btnClass="btn-danger"
        handleDeleteProduct={handleDeleteProduct}
      />

      {/* toast */}
      <Toasts modalRef={toastRef} toastMesage={toastMesage} isErrorMessage={isErrorMessage} />
    </>
  );
};
