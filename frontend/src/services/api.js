import axios from 'axios';

// Base URL comes from .env file (VITE_ prefix required for Vite)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Response interceptor — if 401 returned, remove bad token
api.interceptors.response.use(
  (res) => res, 
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem('token')){
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;