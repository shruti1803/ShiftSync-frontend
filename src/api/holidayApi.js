import api from './axios';

export const getAllHolidays = (from, to) =>
  api.get(`/holidays?from=${from}&to=${to}`);
export const getIndiaHolidays = (from, to) =>
  api.get(`/holidays/india?from=${from}&to=${to}`);
export const getUsHolidays = (from, to) =>
  api.get(`/holidays/us?from=${from}&to=${to}`);
export const getTodayHolidays = () => api.get('/holidays/today');