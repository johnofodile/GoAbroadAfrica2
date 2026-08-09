import api from './api';

export const getPrograms  = (params) => api.get('/programs', { params });
export async function getProgram(id){
return api.get(`/programs/${id}`);

}export const getCountries = ()       => api.get('/programs/countries');


