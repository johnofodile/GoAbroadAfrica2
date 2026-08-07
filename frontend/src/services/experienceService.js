import api from './api';

export const getExperiences   = (params)  => api.get('/experiences', { params });
export const getExperience    = (id)       => api.get(`/experiences/${id}`);
export const createExperience = (formData) => api.post('/experiences', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export async function deleteExperience(id) {
  return api.delete(`/experiences/${id}`);
}

export async function likeExperience(id) {
  return api.post(`/experiences/${id}/like`);
}

export async function addComment(id, data) {
  return api.post(`/experiences/${id}/comments`, data);
}