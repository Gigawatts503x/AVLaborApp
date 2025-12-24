import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🌐 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.status}`);
    return response.data;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.message);
    throw error;
  }
);

// ============================================================================
// EVENTS API
// ============================================================================

export const eventsAPI = {
  getAll: () => apiClient.get('/events'),
  getById: (id) => apiClient.get(`/events/${id}`),
  create: (data) => apiClient.post('/events', data),
  update: (id, data) => apiClient.put(`/events/${id}`, data),
  delete: (id) => apiClient.delete(`/events/${id}`),
};

// ============================================================================
// TECHNICIANS API
// ============================================================================

export const techniciansAPI = {
  getAll: () => apiClient.get('/technicians'),
  getById: (id) => apiClient.get(`/technicians/${id}`),
  create: (data) => apiClient.post('/technicians', data),
  update: (id, data) => apiClient.put(`/technicians/${id}`, data),
  delete: (id) => apiClient.delete(`/technicians/${id}`),
};

// ============================================================================
// REQUIREMENTS API
// ============================================================================

export const requirementsAPI = {
  getByEventId: (eventId) =>
    apiClient.get(`/events/${eventId}/requirements`),
  create: (data) => apiClient.post('/requirements', data),
  update: (id, data) => apiClient.patch(`/requirements/${id}`, data),
  delete: (id) => apiClient.delete(`/requirements/${id}`),
};

// ============================================================================
// ASSIGNMENTS API
// ============================================================================

export const assignmentsAPI = {
  getAll: () => apiClient.get('/assignments'),
  getByEventId: (eventId) =>
    apiClient.get(`/events/${eventId}/assignments`),
  create: (data) => apiClient.post('/assignments', data),
  update: (id, data) => apiClient.patch(`/assignments/${id}`, data),
  delete: (id) => apiClient.delete(`/assignments/${id}`),
};

// ============================================================================
// POSITIONS API
// ============================================================================

export const positionsAPI = {
  getAll: () => apiClient.get('/settings/positions'),
  create: (data) => apiClient.post('/settings/positions', data),
  delete: (name) =>
    apiClient.delete(`/settings/positions/${encodeURIComponent(name)}`),
};

// ============================================================================
// SETTINGS API
// ============================================================================

export const settingsAPI = {
  get: () => apiClient.get('/settings'),
  update: (data) => apiClient.put('/settings', data),
};

// ============================================================================
// HEALTH CHECK
// ============================================================================

export const healthAPI = {
  check: () => apiClient.get('/health'),
};

export default apiClient;
