import api from './axios';

export const getUpcomingOnCall = () => api.get('/on-call/upcoming');
export const getRoster = (from, to) =>
  api.get(`/on-call/roster?from=${from}&to=${to}`);
export const acknowledgeOnCall = (id) =>
  api.patch(`/on-call/${id}/acknowledge`);