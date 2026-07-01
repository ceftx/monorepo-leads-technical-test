import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authApi } from './authApi';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Flag para evitar múltiples refresh simultáneos
let isRefreshing = false;

// Cola de requests pendientes que esperan el nuevo token
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Agregar token JWT
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Manejar errores 401 con refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Solo manejar errores 401
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Si ya estamos en proceso de refresh, no iniciar otro
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    // Marcar como retry para evitar loop infinito
    originalRequest._retry = true;

    // Obtener el token actual
    const currentToken = localStorage.getItem(TOKEN_KEY);

    // Si no hay token, no se puede hacer refresh
    if (!currentToken) {
      // Limpiar storage y notificar
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.dispatchEvent(new CustomEvent('auth:logout'));
      return Promise.reject(error);
    }

    isRefreshing = true;

    try {
      // Intentar refresh del token
      const response = await authApi.refreshToken(currentToken);

      if (response.success && response.data) {
        const { token, user } = response.data;

        // Actualizar storage
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        // Procesar cola de requests pendientes
        processQueue(null, token);

        // Reintentar request original
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } else {
        throw new Error('Refresh failed');
      }
    } catch (refreshError) {
      // Refresh falló, limpiar y notificar logout
      processQueue(refreshError as Error, null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.dispatchEvent(new CustomEvent('auth:logout'));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
