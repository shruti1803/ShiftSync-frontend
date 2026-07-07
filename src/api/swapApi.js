import api from './axios';

export const getMySwaps = (page = 0) =>
  api.get(`/shift-swaps?page=${page}&size=10`);
export const getIncomingSwaps = () => api.get('/shift-swaps/incoming');
export const requestSwap = (data) => api.post('/shift-swaps', data);
export const respondToSwap = (id, data) =>
  api.patch(`/shift-swaps/${id}/respond`, data);
export const cancelSwap = (id) => api.patch(`/shift-swaps/${id}/cancel`);