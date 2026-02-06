import { uploadImage } from '../api/server/admin';
import { Form } from 'antd';
import { rules } from '@/utils/formRules';

const ProductModal = ({
  isOpen = false,
  onClose = () => {},
  product = {},
  onProductChange,
  isLoading = false,
  isEditing = false,
  onAction,
}) => {
  const [form] = Form.useForm();
  const [localProduct, setLocalProduct] = useState(product);

  // 當 Modal 開啟或 product 變動時，同步表單與 localProduct
  useEffect(() => {
    if (isOpen) {
      // 畫面開啟時以傳入的 product 為主，設定表單值
      setLocalProduct(product);
      form.setFieldsValue(product || {});
    } else {
      // 關閉時重置表單
      form.resetFields();
    }
  }, [isOpen, product, form]);

  // 處理輸入框變更
  const handleSetProduct = (changedValues, allValues) => {
    const updated = { ...localProduct, ...allValues };
    setLocalProduct(updated);
    onProductChange?.(updated);
  };

  // 新增或編輯產品
  const handleProductAction = async () => {
    try {
      const values = await form.validateFields();
      const submittedProduct = { ...localProduct, ...values };
      if (onAction) {
        await onAction(submittedProduct, isEditing);
        onClose();
      }
    } catch (error) {
      console.error('驗證失敗：', error);
    }
  };

  // 處理上傳圖片
  const [isUploading, setIsUploading] = useState(false);
  const handleUploadImage = async (info) => {
    const file = info.file;
    if (file && file instanceof File) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file-to-upload', file);
      try {
        const { data } = await uploadImage(formData);
        if (data.success) {
          const updatedImages = [...(localProduct.imagesUrl || []), data.imageUrl];
          const updated = { ...localProduct, imagesUrl: updatedImages };
          setLocalProduct(updated);
          onProductChange?.(updated);
        }
      } catch (error) {
        console.error('圖片上傳失敗：', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // 刪除圖片
  const handleDeleteImage = () => {
    const updatedImages = localProduct.imagesUrl?.slice(0, -1) || [];
    const updated = { ...localProduct, imagesUrl: updatedImages };
    setLocalProduct(updated);
    onProductChange?.(updated);
  };

  return (
    <Modal
      // 這邊添加 key 的原因在於 React 會根據 key 值做判定是否不同 key
      // 是的話會將其從 DOM 移除，再呈現另外一個，就可以去重置被移除元件的 state。
      key={product.id}
      title={isEditing ? '編輯產品' : '新增產品'}
      open={isOpen}
      onCancel={onClose}
      width={1000}
      maskClosable={false}
      forceRender
      footer={[
        <Button key="cancel" onClick={onClose} disabled={isLoading}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={isLoading} onClick={handleProductAction}>
          確認
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onValuesChange={handleSetProduct} initialValues={localProduct}>
        <Row gutter={16}>
          <Col xs={24} sm={6}>
            <Form.Item label="輸入圖片網址" name="imageUrl">
              <Input placeholder="請輸入圖片連結" disabled={isLoading} />
            </Form.Item>
            {localProduct.imageUrl && (
              <Image src={localProduct.imageUrl} alt="主圖" style={{ width: '100%', marginBottom: '16px' }} />
            )}
            {localProduct.imagesUrl?.map((url) => (
              <Image key={url} src={url} alt="副圖" style={{ width: '100%', marginBottom: '16px' }} />
            ))}
            <Upload beforeUpload={() => false} onChange={handleUploadImage} accept="image/*" showUploadList={false}>
              <Button block icon={<PlusOutlined />} disabled={isLoading || isUploading} style={{ marginBottom: '8px' }}>
                新增圖片
              </Button>
            </Upload>
            <Button
              block
              danger
              icon={<DeleteOutlined />}
              onClick={handleDeleteImage}
              disabled={isLoading || isUploading || !localProduct.imagesUrl?.length}
            >
              刪除圖片
            </Button>
          </Col>

          <Col xs={24} sm={18}>
            <Form.Item label="標題" name="title" rules={[...rules.required('請輸入標題')]}>
              <Input placeholder="請輸入標題" disabled={isLoading} />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="分類" name="category" rules={[...rules.required('請輸入分類')]}>
                  <Input placeholder="請輸入分類" disabled={isLoading} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="單位" name="unit" rules={[...rules.required('請輸入單位')]}>
                  <Input placeholder="請輸入單位" disabled={isLoading} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="原價" name="origin_price" rules={[...rules.required('請輸入原價')]}>
                  <InputNumber min={0} style={{ width: '100%' }} disabled={isLoading} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="售價" name="price" rules={[...rules.required('請輸入售價')]}>
                  <InputNumber min={0} style={{ width: '100%' }} disabled={isLoading} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="評價星級" name="rating">
              <Rate disabled={isLoading} value={localProduct.rating} />
            </Form.Item>

            <Form.Item label="產品描述" name="description" rules={[...rules.required('請輸入產品描述')]}>
              <Input.TextArea placeholder="請輸入產品描述" disabled={isLoading} rows={4} />
            </Form.Item>

            <Form.Item label="說明內容" name="content" rules={[...rules.required('請輸入說明內容')]}>
              <Input.TextArea placeholder="請輸入說明內容" disabled={isLoading} rows={4} />
            </Form.Item>

            <Form.Item name="is_enabled" valuePropName="checked">
              <Checkbox disabled={isLoading}>是否啟用</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ProductModal;
