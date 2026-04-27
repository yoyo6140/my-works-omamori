import Cookies from 'js-cookie'

export const API_BASE = process.env.VUE_APP_API
export const API_PATH = process.env.VUE_APP_PATH

export function apiUrl(path) {
  const base = (API_BASE || '').replace(/\/$/, '')
  const p = (path || '').replace(/^\//, '')
  return `${base}/${p}`
}

export function adminHeaders() {
  const token = Cookies.get('token') || ''
  return token ? { Authorization: token } : {}
}

export const API = {
  adminSignIn: () => apiUrl('admin/signin'),

  // Admin
  adminProducts: (page = 1) => apiUrl(`api/${API_PATH}/admin/products/?page=${page}`),
  adminProduct: (id) => apiUrl(`api/${API_PATH}/admin/product/${id}`),
  adminCreateProduct: () => apiUrl(`api/${API_PATH}/admin/product`),
  adminUpload: () => apiUrl(`api/${API_PATH}/admin/upload`),

  adminOrders: (page = 1) => apiUrl(`api/${API_PATH}/admin/orders/?page=${page}`),
  adminOrder: (id) => apiUrl(`api/${API_PATH}/admin/order/${id}`),

  adminCoupons: (page = 1) => apiUrl(`api/${API_PATH}/admin/coupons/?page=${page}`),
  adminCoupon: () => apiUrl(`api/${API_PATH}/admin/coupon`),
  adminCouponById: (id) => apiUrl(`api/${API_PATH}/admin/coupon/${id}`),

  // User
  productsAll: () => apiUrl(`api/${API_PATH}/products/all`),
  product: (id) => apiUrl(`api/${API_PATH}/product/${id}`),
  cart: () => apiUrl(`api/${API_PATH}/cart`),
  cartItem: (id) => apiUrl(`api/${API_PATH}/cart/${id}`),
  coupon: () => apiUrl(`api/${API_PATH}/coupon`),
  order: () => apiUrl(`api/${API_PATH}/order`),
  orderById: (id) => apiUrl(`api/${API_PATH}/order/${id}`),
  pay: (orderId) => apiUrl(`api/${API_PATH}/pay/${orderId}`),
}

