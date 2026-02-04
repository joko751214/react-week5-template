import request from '../axios';

const path = import.meta.env.VITE_API_PATH;

// 取得後台產品列表
export function getProducts(params) {
  return request({
    url: `/api/${path}/admin/products`,
    method: 'get',
    params,
  });
}

// 新增產品
export function addProduct(data) {
  return request({
    url: `/api/${path}/admin/product`,
    method: 'post',
    data: {data}
  });
}

// 刪除產品
export function deleteProduct(id) {
  return request({
    url: `/api/${path}/admin/product/${id}`,
    method: 'delete',
  });
}

// 編輯產品
export function editProduct(data) {
  return request({
    url: `/api/${path}/admin/product/${data.id}`,
    method: 'put',
    data: {data}
  });
}

export function uploadImage(data) {
  return request({
    url: `/api/${path}/admin/upload`,
    method: 'post',
    data,
  });
}