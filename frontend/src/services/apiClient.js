/**
 * Unified API Client for VANTA Storefront
 * Handles HTTP requests, JWT token injection, response standardization, and error handling.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  /**
   * Helper to retrieve active auth token
   */
  getToken() {
    try {
      return localStorage.getItem('vanta_token') || null;
    } catch {
      return null;
    }
  }

  /**
   * Core HTTP request executor
   */
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const headers = {
      ...(options.isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    };

    const token = this.getToken();
    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    if (options.body && !options.isFormData && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      let data = null;

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        const error = new Error(data?.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      // Re-throw standardized error
      if (!err.status) {
        err.message = err.message || 'Network connection failed. Please ensure the backend is running.';
      }
      throw err;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const client = new ApiClient(API_BASE_URL);

/**
 * Authentication Endpoints
 */
export const authApi = {
  login: (credentials) => client.post('/auth/login', credentials),
  register: (userData) => client.post('/auth/register', userData),
  googleLogin: (profileData) => client.post('/auth/google', profileData),
  getMe: () => client.get('/auth/me'),
  updateProfile: (profileData) => client.put('/auth/profile', profileData),
  changePassword: (data) => client.put('/auth/change-password', data),
};

/**
 * Products & Catalog Endpoints
 */
export const productsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return client.get(`/products${queryString}`);
  },
  getFeatured: () => client.get('/products/featured'),
  getCategoriesSummary: () => client.get('/products/categories-summary'),
  getByIdOrSlug: (idOrSlug) => client.get(`/products/${idOrSlug}`),
  getRelated: (id) => client.get(`/products/related?id=${id}`),
  create: (productData) => client.post('/products', productData),
  update: (id, productData) => client.put(`/products/${id}`, productData),
  delete: (id) => client.delete(`/products/${id}`),
  uploadImage: (formData) => client.post('/products/upload-image', formData, { isFormData: true }),
  uploadImages: (formData) => client.post('/products/upload-images', formData, { isFormData: true }),
};

/**
 * Categories Endpoints
 */
export const categoriesApi = {
  getAll: () => client.get('/categories'),
  getById: (id) => client.get(`/categories/${id}`),
};

/**
 * Orders Endpoints
 */
export const ordersApi = {
  getMyOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return client.get(`/orders/my-orders${query ? `?${query}` : ''}`);
  },
  getAllOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return client.get(`/orders${query ? `?${query}` : ''}`);
  },
  createOrder: (orderData) => client.post('/orders', orderData),
  getOrderById: (id) => client.get(`/orders/${id}`),
  updateOrderStatus: (id, statusData) => client.put(`/orders/${id}/status`, statusData),
  payOrder: (id, paymentResult) => client.put(`/orders/${id}/pay`, paymentResult),
};

/**
 * Persistent Cart Endpoints
 */
export const cartApi = {
  getCart: () => client.get('/cart'),
  addItem: (item) => client.post('/cart/items', item),
  updateItem: (itemId, quantity) => client.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => client.delete(`/cart/items/${itemId}`),
  clearCart: () => client.delete('/cart'),
};

/**
 * Server Health & Status
 */
export const healthApi = {
  check: () => client.get('/health'),
};
