import { useEffect, useState, useRef } from "react";
import { Modal } from "bootstrap";
import { uploadImage } from "../api/server/product";
import StarIcon from "../SVGIcons/StarIcon";

const ProductModal = ({
  modalRef,
  product = {},
  onProductChange,
  isLoading = false,
  isEditing = false,
  onAction,
}) => {
  const [localProduct, setLocalProduct] = useState(product);

  // 同步外部 product 變更
  useEffect(() => {
    setLocalProduct(product);
  }, [product]);

  // Modal 初始化
  useEffect(() => {
    if (modalRef.current && !modalRef.current._instance) {
      modalRef.current = new Modal(modalRef.current, {
        keyboard: false,
        backdrop: "static",
      });
    }
  }, [modalRef]);

  // 處理輸入框變更
  const handleSetProduct = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = value;
    // number 轉成數字
    if (type === "number") {
      newValue = value === "" ? "" : Number(value);
    }

    // checkbox 處理
    if (type === "checkbox") {
      newValue = checked ? 1 : 0;
    }

    const updated = { ...localProduct, [name]: newValue };
    setLocalProduct(updated);
    onProductChange?.(updated);
  };

  // 新增或編輯產品
  const handleProductAction = async () => {
    if (onAction) {
      await onAction(localProduct, isEditing);
    }
  };

  // 處理上傳圖片
  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file-to-upload", file);
      try {
        const { data } = await uploadImage(formData);
        console.log(data, "upload response");
        if (data.success) {
          const updatedImages = [...localProduct.imagesUrl, data.imageUrl];
          const updated = { ...localProduct, imagesUrl: updatedImages };
          setLocalProduct(updated);
          onProductChange?.(updated);
        }
      } catch (error) {
        console.error("圖片上傳失敗：", error);
      }
    }
  };

  const fileInputRef = useRef(null);
  // 點擊隱藏的 file input
  const handleClickUploadButton = () => {
    fileInputRef.current?.click();
  };

  // 刪除圖片
  const handleDeleteImage = () => {
    const updatedImages = localProduct.imagesUrl?.slice(0, -1) || [];
    const updated = { ...localProduct, imagesUrl: updatedImages };
    setLocalProduct(updated);
    onProductChange?.(updated);
  };

  // 處理星級評分
  const handleRating = (rating) => {
    console.log(rating, "rating");
    const updated = { ...localProduct, rating };
    console.log(updated, " updated");
    setLocalProduct(updated);
    onProductChange?.(updated);
  };

  // 渲染星級評分
  const renderStars = () => {
    const currentRating = localProduct.rating || 0;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => handleRating(i)}
          style={{ cursor: "pointer", marginRight: "8px", fontSize: "24px" }}
          title={`${i} 星`}
        >
          {/* {i <= currentRating ? "★" : "☆"} */}
          <StarIcon
            fill={i <= currentRating}
            color={i <= currentRating ? "orange" : ""}
          />
        </span>,
      );
    }
    return stars;
  };

  return (
    <div
      className="modal fade"
      tabIndex="-1"
      ref={modalRef}
      aria-labelledby="productModalLabel"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title">
              <span>{isEditing ? "編輯產品" : "新增產品"}</span>
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-sm-4">
                <div className="mb-2">
                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label">
                      輸入圖片網址
                    </label>
                    <input
                      id="imageUrl"
                      name="imageUrl"
                      type="text"
                      value={localProduct.imageUrl || ""}
                      className="form-control"
                      placeholder="請輸入圖片連結"
                      onChange={handleSetProduct}
                    />
                  </div>
                  <img
                    className="img-fluid"
                    src={localProduct.imageUrl || ""}
                    alt="主圖"
                  />
                  {localProduct.imagesUrl?.map((url) => (
                    <img
                      key={url}
                      className="img-fluid mt-2"
                      src={url}
                      alt="副圖"
                    />
                  ))}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  style={{ display: "none" }}
                />
                <div>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm d-block w-100"
                    onClick={handleClickUploadButton}
                    disabled={isLoading}
                  >
                    新增圖片
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm d-block w-100"
                    onClick={handleDeleteImage}
                    disabled={isLoading}
                  >
                    刪除圖片
                  </button>
                </div>
              </div>
              <div className="col-sm-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    標題
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={localProduct.title || ""}
                    className="form-control"
                    placeholder="請輸入標題"
                    onChange={handleSetProduct}
                  />
                </div>

                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      id="category"
                      name="category"
                      type="text"
                      value={localProduct.category || ""}
                      className="form-control"
                      placeholder="請輸入分類"
                      onChange={handleSetProduct}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      id="unit"
                      name="unit"
                      type="text"
                      value={localProduct.unit || ""}
                      className="form-control"
                      placeholder="請輸入單位"
                      onChange={handleSetProduct}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="origin_price" className="form-label">
                      原價
                    </label>
                    <input
                      id="origin_price"
                      name="origin_price"
                      type="number"
                      min="0"
                      value={localProduct.origin_price || ""}
                      className="form-control"
                      placeholder="請輸入原價"
                      onChange={handleSetProduct}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="price" className="form-label">
                      售價
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      value={localProduct.price || ""}
                      className="form-control"
                      placeholder="請輸入售價"
                      onChange={handleSetProduct}
                    />
                  </div>
                </div>
                <hr />

                <div className="mb-3">
                  <label className="form-label">評價星級</label>
                  <div>{renderStars()}</div>
                  <small className="text-muted">
                    {localProduct.rating || 0} / 5
                  </small>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    產品描述
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={localProduct.description || ""}
                    className="form-control"
                    placeholder="請輸入產品描述"
                    onChange={handleSetProduct}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    說明內容
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={localProduct.content || ""}
                    className="form-control"
                    placeholder="請輸入說明內容"
                    onChange={handleSetProduct}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      id="is_enabled"
                      name="is_enabled"
                      className="form-check-input"
                      type="checkbox"
                      checked={localProduct.is_enabled || false}
                      onChange={handleSetProduct}
                    />
                    <label className="form-check-label" htmlFor="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-dismiss="modal"
              disabled={isLoading}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleProductAction}
              disabled={isLoading}
            >
              {isLoading && (
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              <span>確認</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
