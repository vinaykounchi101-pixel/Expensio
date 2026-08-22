import api from './api';

export const analyticsService = {
  getSummary: (params) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    );
    return api.get('/analytics/summary', { params: cleanParams });
  },
  
  getBreakdown: (params) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    );
    return api.get('/analytics/breakdown', { params: cleanParams });
  },
  
  getTrend: (params) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    );
    return api.get('/analytics/trend', { params: cleanParams });
  }
};
