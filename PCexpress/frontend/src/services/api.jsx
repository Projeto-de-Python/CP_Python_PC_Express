import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getLowStock: () => api.get('/products/low-stock'),
  // New Analytics endpoints
  getAnalytics: (id) => api.get(`/products/${id}/analytics`),
  getInsights: (id) => api.get(`/products/${id}/insights`),
  getAllAnalytics: () => api.get('/products/analytics/all'),
  getAllInsights: () => api.get('/products/insights/all'),
  getReorderNeeded: () => api.get('/products/analytics/reorder-needed'),
  getDeadStock: () => api.get('/products/insights/dead-stock'),
  getSlowMoving: () => api.get('/products/insights/slow-moving'),
};

// Suppliers API
export const suppliersAPI = {
  getAll: () => api.get('/suppliers'),
  getById: (id) => api.get(`/suppliers/${id}`),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
};

// Stock API
export const stockAPI = {
  addStock: (productId, data) => api.post(`/products/${productId}/stock/add`, data),
  removeStock: (productId, data) => api.post(`/products/${productId}/stock/remove`, data),
  setStock: (productId, data) => api.put(`/products/${productId}/stock/set`, data),
  getMovements: (productId) => api.get(`/products/${productId}/movements`),
};

// Alerts API
export const alertsAPI = {
  getLowStock: () => api.get('/alerts/low-stock'),
};

// Purchase Orders API
export const purchaseOrdersAPI = {
  getAll: (params = {}) => api.get('/purchase-orders', { params }),
  getById: (id) => api.get(`/purchase-orders/${id}`),
  create: (data) => api.post('/purchase-orders', data),
  update: (id, data) => api.put(`/purchase-orders/${id}`, data),
  delete: (id) => api.delete(`/purchase-orders/${id}`),
  approve: (id) => api.post(`/purchase-orders/${id}/approve`),
  receive: (id, data) => api.post(`/purchase-orders/${id}/receive`, data),
  autoGenerate: (supplierId) => api.post('/purchase-orders/auto-generate', { fornecedor_id: supplierId }),
};

// Insights API (Simplified)
export const insightsAPI = {
  getOverview: () => api.get('/insights/overview'),
  getProductInsights: (productId) => api.get(`/insights/product/${productId}`),
  getLowStockAlerts: () => api.get('/insights/low-stock-alerts'),
  generateSalesData: (days = 30) => api.post(`/insights/generate-sales-data?days=${days}`),
  
  // ML endpoints
  getDemandPrediction: (productId, daysAhead = 30) =>
    api.get(`/insights/ml/demand-prediction/${productId}?days_ahead=${daysAhead}`),
    
  getPriceOptimization: (productId) =>
    api.get(`/insights/ml/price-optimization/${productId}`),
    
  getAnomalyDetection: (productId = null) =>
    api.get(`/insights/ml/anomaly-detection${productId ? `?product_id=${productId}` : ''}`),
    
  getStockOptimization: (productId) =>
    api.get(`/insights/ml/stock-optimization/${productId}`),
    
  getMLProductInsights: (productId) =>
    api.get(`/insights/ml/product-insights/${productId}`),
    
  // New Multi-Product ML endpoints
  getMultiProductAnalysis: (productIds) =>
    api.get(`/insights/ml/multi-product-analysis?product_ids=${productIds}`),
    
  getMLComparisonDashboard: () =>
    api.get('/insights/ml/comparison-dashboard'),
    
  getProductVisualizationData: (productId, chartType = 'all') =>
    api.get(`/insights/ml/visualization-data/${productId}?chart_type=${chartType}`),
};

// Auto Restock API (Simplified)
export const autoRestockAPI = {
  getAnalysis: () => api.get('/auto-restock/analysis'),
  restockAll: () => api.post('/auto-restock/restock-all'),
  restockProduct: (productId) => api.post(`/auto-restock/restock-product/${productId}`),
};

export default api;
