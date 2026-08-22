import axios from 'axios';

let baseUrl = import.meta.env.VITE_API_URL || '/api/v1';

// Automatically append /api/v1 if the user only configured the main backend domain
if (baseUrl && !baseUrl.endsWith('/api/v1') && !baseUrl.endsWith('/api/v1/')) {
  baseUrl = baseUrl.replace(/\/+$/, '') + '/api/v1';
}

const api = axios.create({
  baseURL: baseUrl,
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
