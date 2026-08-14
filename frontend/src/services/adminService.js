import api from './api';

export const getExperiences         = (params) => api.get('/admin/experiences', { params });
export const updateExperienceStatus = (id, status) => api.patch(`/admin/experiences/${id}/status`, { status });
