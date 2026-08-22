import api from './api';

export const expenseService = {
  create: (data) => api.post('/expenses', data),
  
  getAll: (params) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    );
    return api.get('/expenses', { params: cleanParams });
  },
  
  getById: (id) => api.get(`/expenses/${id}`),
  
  update: (id, data) => api.put(`/expenses/${id}`, data),
  
  delete: (id) => api.delete(`/expenses/${id}`),
};
