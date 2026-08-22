import axios from 'axios';

// In dev: use relative path so Vite proxy routes /api → localhost:8080 (no CORS).
// In prod (Vercel): VITE_API_URL is set to the full Render backend URL.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
