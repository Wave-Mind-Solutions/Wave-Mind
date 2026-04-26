/**
 * Admin Service  –  /api/admin/*
 */
import api from './api';

/** GET /api/admin/requirements */
export const getAllRequirements = async (params = {}) => {
  const res = await api.get('/admin/requirements', { params });
  return res.data;
};

/** GET /api/admin/projects */
export const getAllProjects = async (params = {}) => {
  const res = await api.get('/admin/projects', { params });
  return res.data;
};

/** POST /api/admin/projects/convert */
export const convertRequirement = async (data) => {
  const res = await api.post('/admin/projects/convert', data);
  return res.data;
};

/** POST /api/admin/projects/assign */
export const assignTeam = async (data) => {
  const res = await api.post('/admin/projects/assign', data);
  return res.data;
};

/** PATCH /api/admin/projects/:id */
export const updateProject = async (id, data) => {
  const res = await api.patch(`/admin/projects/${id}`, data);
  return res.data;
};

/** GET /api/admin/specialists */
export const getDevelopers = async (params = {}) => {
  const res = await api.get('/admin/specialists', { params });
  return res.data;
};

/** POST /api/admin/tasks */
export const createTask = async (data) => {
  const res = await api.post('/admin/tasks', data);
  return res.data;
};

/** GET /api/admin/deliverables */
export const getAllDeliverables = async () => {
  const res = await api.get('/admin/deliverables');
  return res.data;
};

/** GET /api/admin/clients */
export const getClients = async () => {
  const res = await api.get('/admin/clients');
  return res.data;
};
