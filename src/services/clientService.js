/**
 * Client Service  –  /api/client/*
 */
import api from './api';

/** POST /api/client/requirements */
export const submitRequirement = async (data) => {
  const res = await api.post('/client/requirements', data);
  return res.data;
};

/** GET /api/client/requirements */
export const getMyRequirements = async () => {
  const res = await api.get('/client/requirements');
  return res.data; // { success, data: [...] }
};

/** GET /api/client/projects */
export const getMyProjects = async () => {
  const res = await api.get('/client/projects');
  return res.data;
};

/** GET /api/client/payments */
export const getPayments = async () => {
  const res = await api.get('/client/payments');
  return res.data;
};
