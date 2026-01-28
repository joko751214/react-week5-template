import { useState, useEffect, useRef } from "react";
import "./App.css";
import { login, checkLogin } from "./api/server/login";
import {
  getProducts,
  deleteProduct,
  editProduct,
  addProduct,
} from "./api/server/product";
import ProductModal from "./component/ProductModal";
import Pagination from "./component/Pagination";
import Toasts from "./component/Toasts";

function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)hexschoolToken\s*\=\s*([^;]*).*$)|^.*$/,
    "$1",
  );

  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // 檢查是否為管理員
  const checkAdmin = async () => {
    try {
      setIsLoading(true);
      await checkLogin();
      setIsAuth(true);
    } catch (err) {
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      checkAdmin();
    }
  }, [token]);

  const [pagination, setPagination] = useState({});
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
  };

  const [products, setProducts] = useState([]);
  // 取得產品列表
  const handleGetProducts = async () => {
    try {
      const { data } = await getProducts({
        page: pagination.current_page || 1,
      });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuth) {
      handleGetProducts();
    }
  }, [isAuth, pagination.current_page]);

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

  const [messageSignIn, setMessageSignIn] = useState("");
  const [isErrorSignIn, setIsErrorSignIn] = useState(false);
  // 登入表單提交
  const handleSubmit = async (event) => {
    event.preventDefault();
    await withBtnLoading("login", async () => {
      try {
        const {
          data: { token, expired },
        } = await login(formData);
        setMessageSignIn("登入成功");
        setIsErrorSignIn(false);
        setTimeout(() => {
          setIsAuth(true);
        }, 1000);
        if (token) {
          document.cookie = `hexschoolToken=${token}; expires=${new Date(expired)};`;
        }
      } catch (error) {
        setIsAuth(false);
        setIsErrorSignIn(true);
        setMessageSignIn(error.response?.data?.message || "未知錯誤");
      }
    });
  };

  // 登入表單輸入變更
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const originProduct = {
    title: "",
    category: "",
    origin_price: "",
    price: "",
    unit: "",
    description: "",
    content: "",
    is_enabled: 0,
    imageUrl: "",
    imagesUrl: [],
  };
  const [product, setProduct] = useState({ ...originProduct });

  const toastRef = useRef(null);

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

  // 新增或編輯產品
  const handleProductAction = async (productData, isEditing) => {
    await withBtnLoading("productAction", async () => {
      try {
        if (isEditing) {
          await editProduct(productData);
        } else {
          await addProduct(productData);
        }
        const message = isEditing ? "編輯成功" : "新增成功";
        setToastMessage(message);
        setIsErrorMessage(false);
        toastRef.current.show();
        setTimeout(() => {
          productModalRef.current.hide();
        }, 500);
        handleGetProducts();
      } catch (error) {
        console.dir(error);
        setToastMessage(error.response.data.message.join(" ") || "操作失敗");
        setIsErrorMessage(true);
        toastRef.current.show();
      }
    });
  };

  const [toastMesage, setToastMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  // 刪除產品
  const handleDeleteProduct = async (id) => {
    await withBtnLoading(`delete_${id}`, async () => {
      try {
        await deleteProduct(id);
        setToastMessage("刪除成功");
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
      ) : isAuth ? (
        <div>
          <div className="container">
            <div className="text-end mt-4">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleOpenModal()}
              >
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
                      <td>
                        {product.is_enabled ? (
                          <span className="text-success">啟用</span>
                        ) : (
                          <span>未啟用</span>
                        )}
                      </td>
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
                            onClick={() => handleDeleteProduct(product.id)}
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
            {pagination.total_pages > 0 && (
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    name="username"
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                  />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                  disabled={btnLoading.login}
                >
                  {btnLoading.login && (
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                  <span>登入</span>
                </button>
                {messageSignIn && (
                  <div
                    className={`alert ${isErrorSignIn ? "alert-danger" : "alert-success"} mt-2 mb-0 p-2`}
                    role="alert"
                  >
                    <div
                      className={`${isErrorSignIn ? "text-danger" : "text-success"}`}
                    >
                      {messageSignIn}
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
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

      {/* toast */}
      <Toasts
        modalRef={toastRef}
        toastMesage={toastMesage}
        isErrorMessage={isErrorMessage}
      />
    </>
  );
}

export default App;
