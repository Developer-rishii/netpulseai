import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your machine's local IP for physical device testing.
// Change this to your computer's IP if on a different network.
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || 'http://192.168.1.7:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request if available
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),

  register: (data: { name: string; email: string; password: string; company?: string }) =>
    api.post('/api/auth/register', data),

  verifyOTP: (email: string, otp: string) =>
    api.post('/api/auth/verify-otp', { email, otp }),

  resendOTP: (email: string) =>
    api.post('/api/auth/resend-otp', { email }),

  updateProfile: (data: { name: string; company?: string }) =>
    api.put('/api/auth/profile', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/api/auth/password', data),
};

// IoT / Metrics API
export const metricsAPI = {
  getRecent: (limit = 30) =>
    api.get(`/api/iot/metrics?limit=${limit}`),
};

// Speed Test API
export const speedTestAPI = {
  run: () => api.get('/api/utils/speedtest'),
};

// Health Check
export const healthAPI = {
  check: () => api.get('/health'),
};

export { BASE_URL };
export default api;
