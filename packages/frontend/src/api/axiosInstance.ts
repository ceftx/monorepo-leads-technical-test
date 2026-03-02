import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Agregar token JWT
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Manejar errores 401 (sin reload automático)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // No hacemos redirect automático en 401 para evitar reloads inesperados
    // El manejo del 401 queda a cargo del código que hace la petición
    return Promise.reject(error);
  }
);

export default axiosInstance;
