import axios from 'axios'

const client = axios.create({ 
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
client.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response unwrapping and auth errors
client.interceptors.response.use(
  response => {
    // If response has data.data structure (ApiResponse), unwrap it
    if (response.data && response.data.data !== undefined) {
      return { ...response, data: response.data.data }
    }
    return response
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const api = {
  // Auth
  login: (credentials) => client.post('/auth/login', credentials),
  register: (userData) => client.post('/auth/register', userData),
  
  // Users
  getUsers: (params) => client.get('/users', { params }),
  getUser: (id) => client.get(`/users/${id}`),
  updateUser: (id, data) => client.put(`/users/${id}`, data),
  deleteUser: (id) => client.delete(`/users/${id}`),
  
  // Products
  getProducts: (params) => client.get('/products', { params }),
  getProduct: (id) => client.get(`/products/${id}`),
  createProduct: (data) => client.post('/products', data),
  updateProduct: (id, data) => client.put(`/products/${id}`, data),
  deleteProduct: (id) => client.delete(`/products/${id}`),
  
  // Orders
  getOrders: (params) => client.get('/orders', { params }),
  getOrder: (id) => client.get(`/orders/${id}`),
  createOrder: (data) => client.post('/orders', data),
  updateOrder: (id, data) => client.put(`/orders/${id}`, data),
  payOrder: (id, data) => client.post(`/orders/${id}/pay`, data),
  
  // Feedback
  getFeedback: (params) => client.get('/feedback', { params }),
  createFeedback: (data) => client.post('/feedback', data),
  deleteFeedback: (id) => client.delete(`/feedback/${id}`),

  // Product-scoped Feedback (backend path)
  getProductFeedbacks: (productId, params) => client.get(`/products/${productId}/feedbacks`, { params }),
  createProductFeedback: (productId, data) => client.post(`/products/${productId}/feedbacks`, data),

  // Addresses
  getAddresses: (params) => client.get('/addresses', { params }),
  getAddress: (id) => client.get(`/addresses/${id}`),
  createAddress: (data) => client.post('/addresses', data),
  updateAddress: (id, data) => client.put(`/addresses/${id}`, data),
  deleteAddress: (id) => client.delete(`/addresses/${id}`)
}

export default api;