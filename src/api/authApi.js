import api from './axios';

export const mockLogin = (email, name) =>
  api.post('/auth/mock-login', { email, name });

export const getMe = () => api.get('/auth/me');