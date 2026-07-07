import api from './axios';

export const getActiveCredits = () => api.get('/comp-off/credits');