/**
 * Time Tracking Service  –  /api/time/*
 */
import api from './api';

/**
 * POST /api/time/log
 * @param {Object} data - { taskId, hours, description, date, billable }
 */
export const logTime = async (data) => {
  const res = await api.post('/time/log', data);
  return res.data;
};

/**
 * GET /api/time/my
 */
export const getMyTimeEntries = async () => {
  const res = await api.get('/time/my');
  return res.data;
};

/**
 * GET /api/time/all (Admin only)
 */
export const getAllTimeEntries = async () => {
  const res = await api.get('/time/all');
  return res.data;
};

/**
 * PATCH /api/time/approve/:id (Admin only)
 * @param {String} id
 * @param {String} status - "Approved" or "Rejected"
 */
export const approveTimeEntry = async (id, status) => {
  const res = await api.patch(`/time/approve/${id}`, { status });
  return res.data;
};
