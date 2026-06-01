import axios from 'axios';

const PRODUCTION_API = 'https://college-portal-server-alpha.vercel.app/api';

const API_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : PRODUCTION_API);

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // IMPORTANT: Allows cookies to be sent with requests
});

// Interceptor to handle global 401 Unauthorized errors (e.g. token expired)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear user state and redirect to login
      sessionStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
