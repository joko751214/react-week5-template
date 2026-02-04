import request from '../axios';

const path = import.meta.env.VITE_API_PATH;

// 取得公開產品列表（前端用）
export function getCartList() {
  return request({
    url: `/api/${path}/cart`,
    method: 'get',
  });
}

// 加入購物車
export function addToCart(data) {
  return request({
    url: `/api/${path}/cart`,
    method: 'post',
    data: {data}
  });
}

// 更新購物車項目數量（假設 API 支援 PUT /cart/{id}）
export function updateCartItem(id, data) {
  return request({
    url: `/api/${path}/cart/${id}`,
    method: 'put',
    data: {data},
  });
}

// 刪除購物車項目
export function deleteCartItem(id) {
  return request({
    url: `/api/${path}/cart/${id}`,
    method: 'delete',
  });
}