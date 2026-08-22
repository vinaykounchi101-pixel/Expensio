import api from './api';

export const budgetService = {
  create: (data) => api.post('/budgets', data),
  
  getAll: (params) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    );
    return api.get('/budgets', { params: cleanParams });
  },
  
  getById: (id) => api.get(`/budgets/${id}`),
  
  update: (id, data) => api.put(`/budgets/${id}`, data),
  
  delete: (id) => api.delete(`/budgets/${id}`),
};
