import api from './axios';

export const getLeaveBalances = () => api.get('/leaves/balances');
export const getMyLeaves = (page = 0) =>
  api.get(`/leaves?page=${page}&size=10`);
export const applyLeave = (data) => api.post('/leaves', data);
export const cancelLeave = (id) => api.patch(`/leaves/${id}/cancel`);
export const getTeamLeaves = (teamName, from, to) =>
  api.get(`/leaves/team?teamName=${teamName}&from=${from}&to=${to}`);