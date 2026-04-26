/**
 * Developer Service  –  /api/dev/*
 */
import api from './api';

/** GET /api/dev/tasks */
export const getMyTasks = async (params = {}) => {
  const res = await api.get('/dev/tasks', { params });
  return res.data;
};

/** PATCH /api/dev/tasks/:id */
export const updateTaskStatus = async (id, status) => {
  const res = await api.patch(`/dev/tasks/${id}`, { status });
  return res.data;
};

/**
 * POST /api/dev/deliverables  (multipart/form-data)
 * @param {FormData} formData  – must include: file, taskId, projectId, fileType
 * @param {Function} onProgress – upload progress callback (0-100)
 */
export const uploadDeliverable = async (formData, onProgress) => {
  const res = await api.post('/dev/deliverables', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
  return res.data;
};

/** GET /api/dev/deliverables */
export const getMyDeliverables = async () => {
  const res = await api.get('/dev/deliverables');
  return res.data;
};

/** GET /api/dev/projects */
export const getMyProjects = async () => {
  const res = await api.get('/dev/projects');
  return res.data;
};
