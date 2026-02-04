import request from '../axios';

const path = import.meta.env.VITE_API_PATH;

// 取得公開產品列表（前端用）
export function getPublicProducts(params) {
  return request({
    url: `/api/${path}/products`,
    method: 'get',
    params,
  });
}

// 取得單一產品詳細資料（前端用）
export function getPublicProduct(id) {
  return request({
    url: `/api/${path}/product/${id}`,
    method: 'get',
  });
}