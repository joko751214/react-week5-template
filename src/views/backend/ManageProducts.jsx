import { useNavigate } from 'react-router';
import { getProducts, editProduct, addProduct, deleteProduct } from '@/api/server/product';
import { checkLogin } from '@/api/server/login';
import ProductModal from '@/component/ProductModal';
import TipsModal from '@/component/TipsModal';

export const ManageProducts = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTipsModalOpen, setIsTipsModalOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);

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

  const [products, setProducts] = useState([]);
  // 取得產品列表
  const handleGetProducts = async (page) => {
    const pageNum = page ?? pagination.current_page ?? 1;
    setIsLoading(true);
    try {
      const { data } = await getProducts({
        page: pageNum,
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
    handleGetProducts(page);
  };

  useEffect(() => {
    checkAdmin();
    handleGetProducts();
  }, []);

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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProduct({ ...originProduct });
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
        const successMessage = isEditing ? '編輯成功' : '新增成功';
        message.success(successMessage);
        handleCloseModal();
        handleGetProducts();
      } catch (error) {
        message.error(error.response?.data?.message?.join(' ') || '操作失敗');
      }
    });
  };

  const [deleteItemTitle, setDeleteItemTitle] = useState('');

  // 開啟刪除確認 Modal
  const handleOpenTipsModal = (productData) => {
    setDeleteItemTitle(productData.title);
    setDeletingProductId(productData.id);
    setIsTipsModalOpen(true);
  };

  const handleCloseTipsModal = () => {
    setIsTipsModalOpen(false);
    setDeleteItemTitle('');
    setDeletingProductId(null);
  };

  // 刪除產品
  const handleDeleteProduct = async () => {
    if (!deletingProductId) return;
    await withBtnLoading(`delete_${deletingProductId}`, async () => {
      try {
        await deleteProduct(deletingProductId);
        message.success('刪除成功');
        handleCloseTipsModal();
        handleGetProducts();
      } catch (err) {
        console.error(err);
        message.error('刪除失敗');
      }
    });
  };
  const columns = [
    { title: '分類', dataIndex: 'category', key: 'category' },
    { title: '產品名稱', dataIndex: 'title', key: 'title' },
    { title: '原價', dataIndex: 'origin_price', key: 'origin_price', align: 'center' },
    { title: '售價', dataIndex: 'price', key: 'price', align: 'center' },
    {
      title: '是否啟用',
      dataIndex: 'is_enabled',
      key: 'is_enabled',
      render: (val) => (val ? <Tag color="green">啟用</Tag> : <span>未啟用</span>),
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
            disabled={btnLoading[`delete_${record.id}`]}
          >
            編輯
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            loading={btnLoading[`delete_${record.id}`]}
            onClick={() => handleOpenTipsModal(record)}
          >
            刪除
          </Button>
        </Space>
      ),
      align: 'center',
    },
  ];

  return (
    <>
      <div className="lg:w-5xl xl:w-7xl mx-auto">
        <div style={{ textAlign: 'right', marginBottom: 16 }}>
          <Button
            className="mt-2"
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            建立新的產品
          </Button>
        </div>

        <Table
          dataSource={products}
          columns={columns}
          rowKey="id"
          pagination={{
            current: pagination.current_page || 1,
            pageSize: pagination.per_page || 10,
            total: pagination.total || (pagination.total_pages || 0) * (pagination.per_page || 10),
            onChange: handlePageChange,
            showSizeChanger: false,
          }}
          loading={isLoading}
        />
      </div>

      {/* 新增、編輯產品 */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={product}
        onProductChange={setProduct}
        isLoading={btnLoading.productAction}
        isEditing={isEditing}
        onAction={handleProductAction}
      />

      {/* 刪除產品 Modal */}
      <TipsModal
        isOpen={isTipsModalOpen}
        onClose={handleCloseTipsModal}
        title={`是否要刪除「${deleteItemTitle}」?`}
        loading={btnLoading[`delete_${deletingProductId}`]}
        onConfirm={handleDeleteProduct}
      />
      {/* toast */}
      {/* <Toasts modalRef={toastRef} toastMesage={toastMesage} isErrorMessage={isErrorMessage} /> */}
    </>
  );
};
