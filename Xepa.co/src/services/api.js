import axios from 'axios';
import { getToken, removeToken } from './auth';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Users API
export const usersAPI = {
  getAll: (params = {}) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  getTeamMembers: () => api.get('/users/team'),
  getWorkers: () => api.get('/users/workers'),
};

// Work Entries API
export const workEntriesAPI = {
  getAll: (params = {}) => api.get('/work-entries', { params }),
  getById: (id) => api.get(`/work-entries/${id}`),
  create: (entryData) => api.post('/work-entries', entryData),
  update: (id, entryData) => api.put(`/work-entries/${id}`, entryData),
  delete: (id) => api.delete(`/work-entries/${id}`),
  submitForApproval: (id) => api.post(`/work-entries/${id}/submit`),
  getByWorker: (workerId, params = {}) => api.get(`/work-entries/worker/${workerId}`, { params }),
  getByStatus: (status, params = {}) => api.get(`/work-entries/status/${status}`, { params }),
  getByDateRange: (startDate, endDate) => api.get('/work-entries/date-range', { 
    params: { startDate, endDate } 
  }),
  getStats: () => api.get('/work-entries/stats'),
};

// Approvals API
export const approvalAPI = {
  getPending: (params = {}) => api.get('/approvals/pending', { params }),
  getProcessed: (params = {}) => api.get('/approvals/processed', { params }),
  getById: (id) => api.get(`/approvals/${id}`),
  process: (id, data) => api.post(`/approvals/${id}/process`, data),
  getApproverStats: () => api.get('/approvals/stats'),
  getByWorker: (workerId) => api.get(`/approvals/worker/${workerId}`),
  getApprovalHistory: (workEntryId) => api.get(`/approvals/history/${workEntryId}`),
};

// Notifications API
export const notificationsAPI = {
  getAll: (params = {}) => api.get('/notifications', { params }),
  getUnread: () => api.get('/notifications/unread'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`),
  deleteAll: () => api.delete('/notifications'),
  create: (notificationData) => api.post('/notifications', notificationData),
  getCount: () => api.get('/notifications/count'),
};

// Projects API
export const projectsAPI = {
  getAll: (params = {}) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (projectData) => api.post('/projects', projectData),
  update: (id, projectData) => api.put(`/projects/${id}`, projectData),
  delete: (id) => api.delete(`/projects/${id}`),
  getMembers: (id) => api.get(`/projects/${id}/members`),
  addMember: (id, userId, role) => api.post(`/projects/${id}/members`, { userId, role }),
  removeMember: (id, userId) => api.delete(`/projects/${id}/members/${userId}`),
  getWorkEntries: (id, params = {}) => api.get(`/projects/${id}/work-entries`, { params }),
  getStats: (id) => api.get(`/projects/${id}/stats`),
};

// Comments API
export const commentsAPI = {
  getByWorkEntry: (workEntryId) => api.get(`/comments/work-entry/${workEntryId}`),
  create: (workEntryId, commentData) => api.post(`/comments/work-entry/${workEntryId}`, commentData),
  update: (id, commentData) => api.put(`/comments/${id}`, commentData),
  delete: (id) => api.delete(`/comments/${id}`),
  getByApproval: (approvalId) => api.get(`/comments/approval/${approvalId}`),
};

// Reports API
export const reportsAPI = {
  generateWorkReport: (params = {}) => api.get('/reports/work', { params }),
  generateApprovalReport: (params = {}) => api.get('/reports/approvals', { params }),
  generateTeamReport: (params = {}) => api.get('/reports/team', { params }),
  generateFinancialReport: (params = {}) => api.get('/reports/financial', { params }),
  downloadReport: (reportId, format = 'pdf') => api.get(`/reports/download/${reportId}`, {
    responseType: 'blob',
    params: { format }
  }),
};

// File Upload API
export const uploadAPI = {
  uploadFile: (file, type = 'attachment') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteFile: (fileId) => api.delete(`/upload/${fileId}`),
  getFile: (fileId) => api.get(`/upload/${fileId}`, { responseType: 'blob' }),
};

// Dashboard API
export const dashboardAPI = {
  getOverview: () => api.get('/dashboard/overview'),
  getRecentActivity: () => api.get('/dashboard/recent-activity'),
  getPerformanceMetrics: () => api.get('/dashboard/performance'),
  getUpcomingDeadlines: () => api.get('/dashboard/upcoming-deadlines'),
};

// Export the axios instance for custom requests
export default api;