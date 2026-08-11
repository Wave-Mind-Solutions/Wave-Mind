/**
 * Client Service  –  /api/projects & /api/client/*
 *
 * Includes fallback to legacy /api/client/* endpoints if /api/projects
 * returns 404 (e.g. against an un-deployed or older backend version).
 */
import api from './api';

/**
 * POST /api/projects
 * Create a new project request with fallback to /client/requirements if 404.
 */
export const submitRequirement = async (data) => {
  try {
    const res = await api.post('/projects', data);
    return res.data;
  } catch (err) {
    if (err?.response?.status === 404) {
      console.warn('[API WARN] /api/projects 404, falling back to /api/client/requirements');

      // Format clean legacy payload (only fields accepted by older server schemas)
      const legacyDescriptionDetails = [
        data.description || '',
        data.projectType ? `Project Type: ${data.projectType}` : '',
        data.businessIndustry ? `Industry: ${data.businessIndustry}` : '',
        data.projectGoal ? `Goal: ${data.projectGoal}` : '',
        data.timeline ? `Timeline: ${data.timeline}` : '',
        Array.isArray(data.requiredFeatures) && data.requiredFeatures.length > 0
          ? `Features: ${data.requiredFeatures.join(', ')}`
          : '',
      ].filter(Boolean).join(' | ');

      const legacyPayload = {
        title: data.title || data.projectType || 'Project Requirement Request',
        description: legacyDescriptionDetails || 'Project Requirement Request',
        budget: Number(data.budget) || 0,
        priority: data.priority || 'Medium',
        techStack: Array.isArray(data.requiredFeatures) ? data.requiredFeatures : [],
        email: data.email || '',
        phone: data.phone || '',
      };

      const res = await api.post('/client/requirements', legacyPayload);
      return res.data;
    }
    throw err;
  }
};

/**
 * GET /api/projects
 * Get authenticated user's projects from MongoDB with fallback to /client/projects.
 */
export const getMyProjects = async () => {
  try {
    const res = await api.get('/projects');
    return res.data;
  } catch (err) {
    if (err?.response?.status === 404) {
      console.warn('[API WARN] /api/projects 404, falling back to /api/client/projects');
      const res = await api.get('/client/projects');
      return res.data;
    }
    throw err;
  }
};

/**
 * GET /api/projects/stats
 * Get project statistics for the authenticated user.
 * Returns { success, stats: { totalProjects, totalBudget, inReview, ... } }
 */
export const getProjectStats = async () => {
  try {
    const res = await api.get('/projects/stats');
    return res.data;
  } catch (err) {
    if (err?.response?.status === 404) {
      // 404 fallback: Return null stats so UI calculates stats client-side from project list
      return { success: true, stats: null };
    }
    throw err;
  }
};

/**
 * GET /api/projects/:id
 * Get a single project by ID.
 */
export const getProjectById = async (id) => {
  const res = await api.get(`/projects/${id}`);
  return res.data;
};

/**
 * PUT /api/projects/:id
 * Update project details.
 */
export const updateProject = async (id, data) => {
  const res = await api.put(`/projects/${id}`, data);
  return res.data;
};

/**
 * PATCH /api/projects/:id/status
 * Update project status (Admin/Developer only).
 */
export const updateProjectStatus = async (id, statusData) => {
  const res = await api.patch(`/projects/${id}/status`, statusData);
  return res.data;
};

/**
 * DELETE /api/projects/:id
 * Delete a project.
 */
export const deleteProject = async (id) => {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
};

/**
 * GET /api/client/requirements
 * Legacy requirement list endpoint.
 */
export const getMyRequirements = async () => {
  const res = await api.get('/client/requirements');
  return res.data;
};

/**
 * GET /api/client/payments
 */
export const getPayments = async () => {
  const res = await api.get('/client/payments');
  return res.data;
};
