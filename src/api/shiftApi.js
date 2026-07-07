import api from './axios';

export const getMyShifts = (from, to) =>
  api.get(`/shifts/my?from=${from}&to=${to}`);
export const getTodayShift = () => api.get('/shifts/today');
export const getTeamShifts = (teamName, from, to) =>
  api.get(`/shifts/team?teamName=${teamName}&from=${from}&to=${to}`);