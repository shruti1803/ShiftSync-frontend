import api from './axios';

export const getWfhBalance = () => api.get('/wfh/balance');
export const getMyWfhRequests = (page = 0) =>
  api.get(`/wfh?page=${page}&size=10`);
export const applyWfh = (data) => api.post('/wfh', data);
export const cancelWfh = (id) => api.patch(`/wfh/${id}/cancel`);