import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ───────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('medipath_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ──────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error.message || 'Something went wrong.';
    return Promise.reject(new Error(message));
  }
);

// ─── API Methods ───────────────────────────────────────────

// Tests
export const fetchTests = (params = {}) => api.get('/tests', { params });
export const fetchCategories = () => api.get('/tests/categories');

// Bookings
export const createBooking = (data) => api.post('/bookings', data);
export const fetchBooking = (id) => api.get(`/bookings/${id}`);

// Prescriptions
export const uploadPrescription = (formData, onUploadProgress) =>
  api.post('/prescriptions/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
export const fetchAdminPrescriptions = () => api.get('/prescriptions');

// Reports
export const lookupReport = (params) => api.get('/reports/lookup', { params });
export const createAdminReport = (data) => api.post('/reports', data);

// Admin
export const adminLogin = (data) => api.post('/admin/login', data);
export const fetchAdminBookings = () => api.get('/admin/bookings');

export const createAdminTest = (data) => api.post('/tests', data);
export const updateAdminTest = (id, data) => api.put(`/tests/${id}`, data);
export const deleteAdminTest = (id) => api.delete(`/tests/${id}`);

// Notices
export const fetchActiveNotices = () => api.get('/notices/active');
export const fetchAllNotices = () => api.get('/notices');
export const createNotice = (data) => api.post('/notices', data);
export const deleteNotice = (id) => api.delete(`/notices/${id}`);
export const toggleNotice = (id) => api.put(`/notices/${id}/toggle`);

export default api;
