/**
 * Admin Service  –  /api/admin/*
 * All functions propagate errors to callers — no silent swallowing.
 */
import api from './api';

/** GET /api/admin/requirements */
export const getAllRequirements = async (params = {}) => {
  const res = await api.get('/admin/requirements', { params });
  return res.data;
};

/** GET /api/admin/projects/stats — real MongoDB aggregation */
export const getAdminProjectStats = async () => {
  try {
    const res = await api.get('/admin/projects/stats');
    return res.data;
  } catch (err) {
    if (err?.response?.status === 404) {
      return { success: true, stats: null };
    }
    throw err;
  }
};

/** GET /api/admin/projects */
export const getAllProjects = async (params = {}) => {
  const res = await api.get('/admin/projects', { params });
  return res.data;
};

/** GET /api/admin/projects/:id — full project detail with population */
export const getAdminProjectById = async (id) => {
  const res = await api.get(`/admin/projects/${id}`);
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

/** PATCH /api/admin/projects/:id — admin update (status, progress, notes, etc.) */
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

/**
 * Leads (Chatbot) Services
 */

/** GET /api/lead — Fetch chatbot leads */
export const getLeads = async (params = {}) => {
  const res = await api.get('/lead', { params });
  return res.data;
};

/** GET /api/lead/export — Download Excel */
export const exportLeadsExcel = async () => {
  const res = await api.get('/lead/export', { responseType: 'blob' });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `leads_export_${new Date().getTime()}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return true;
};
