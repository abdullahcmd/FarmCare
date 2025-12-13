import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => {
    const formData = new FormData();
    formData.append('username', data.number);
    formData.append('password', data.password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Profile APIs
export const profileAPI = {
  getProfile: () => api.get('/profile/'),
  updateProfile: (data) => api.put('/profile/', data),
};

// Crop APIs
export const cropAPI = {
  getAll: () => api.get('/crops/'),
  getById: (id) => api.get(`/crops/${id}`),
  getDetails: (id) => api.get(`/crops/${id}/details`),
  create: (data) => api.post('/crops/', data),
  update: (id, data) => api.put(`/crops/${id}`, data),
  delete: (id) => api.delete(`/crops/${id}`),
};

// Crop Log APIs
export const cropLogAPI = {
  getAll: (cropId) => api.get(`/crops/${cropId}/logs`),
  getById: (cropId, logId) => api.get(`/crops/${cropId}/logs/${logId}`),
  create: (cropId, data) => api.post(`/crops/${cropId}/logs`, data),
  update: (cropId, logId, data) => api.put(`/crops/${cropId}/logs/${logId}`, data),
  delete: (cropId, logId) => api.delete(`/crops/${cropId}/logs/${logId}`),
};

// Problem APIs
export const problemAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status_filter', filters.status);
    if (filters.issue_type) params.append('issue_type', filters.issue_type);
    return api.get(`/problems/?${params.toString()}`);
  },
  getById: (id) => api.get(`/problems/${id}`),
  create: (data) => api.post('/problems/', data),
  update: (id, data) => api.put(`/problems/${id}`, data),
  close: (id) => api.patch(`/problems/${id}/close`),
  reopen: (id) => api.patch(`/problems/${id}/reopen`),
};

// Expert APIs
export const expertAPI = {
  getProblems: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status_filter) params.append('status_filter', filters.status_filter);
    if (filters.issue_type) params.append('issue_type', filters.issue_type);
    if (filters.crop_type) params.append('crop_type', filters.crop_type);
    if (filters.severity) params.append('severity', filters.severity);
    return api.get(`/expert/problems?${params.toString()}`);
  },
  getProblem: (id) => api.get(`/expert/problems/${id}`),
  diagnose: (id, data) => api.post(`/expert/problems/${id}/diagnose`, data),
  updateDiagnosis: (id, data) => api.put(`/expert/problems/${id}/diagnose`, data),
  resolve: (id) => api.patch(`/expert/problems/${id}/resolve`),
  addFollowup: (id, data) => api.patch(`/expert/problems/${id}/followup`, data),
};

// Dashboard APIs
export const dashboardAPI = {
  getFarmerDashboard: () => api.get('/dashboard/farmer'),
  getExpertDashboard: () => api.get('/dashboard/expert'),
};

export default api;
