import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

// JWT interceptor
api.interceptors.request.use((config) => {
    const stored = localStorage.getItem('krishisaathi_user');
    if (stored) {
        try {
            const { token } = JSON.parse(stored);
            if (token) config.headers.Authorization = `Bearer ${token}`;
        } catch { /* ignore */ }
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('krishisaathi_user');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

// ─── Auth ───
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    me: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
};

// ─── Crops (Farmer) ───
export const cropAPI = {
    add: (data) => api.post('/crops/add', data),
    myListings: () => api.get('/crops/my-listings'),
    get: (id) => api.get(`/crops/${id}`),
    update: (id, data) => api.put(`/crops/${id}`, data),
    delete: (id) => api.delete(`/crops/${id}`),
};

// ─── Marketplace (Public + Buyer) ───
export const marketAPI = {
    list: (params) => api.get('/marketplace', { params }),
    bid: (data) => api.post('/marketplace/bid', data),
    bids: (listingId) => api.get(`/marketplace/bids/${listingId}`),
    myBids: () => api.get('/marketplace/my-bids'),
    acceptBid: (id) => api.put(`/marketplace/bid/${id}/accept`),
    rejectBid: (id) => api.put(`/marketplace/bid/${id}/reject`),
    withdrawBid: (id) => api.delete(`/marketplace/bid/${id}`),
};

// ─── Orders ───
export const orderAPI = {
    create: (data) => api.post('/order/create', data),
    history: () => api.get('/order/history'),
    get: (id) => api.get(`/order/${id}`),
    updateStatus: (id, data) => api.put(`/order/${id}/status`, data),
    cancel: (id) => api.put(`/order/${id}/cancel`),
    verifyPayment: (data) => api.post('/order/verify-payment', data),
};

// ─── Products (Agri Store) ───
export const productAPI = {
    list: (params) => api.get('/products', { params }),
    get: (id) => api.get(`/products/${id}`),
};

// ─── Insurance ───
export const insuranceAPI = {
    list: () => api.get('/insurance'),
    get: (id) => api.get(`/insurance/${id}`),
};

// ─── Disease Detection ───
export const detectionAPI = {
    predict: (formData) => api.post('/detection/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
    }),
    history: () => api.get('/detection/history'),
};

export default api;
