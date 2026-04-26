/**
 * Auth Service  –  /api/auth/*
 */
import api from './api';

/** POST /api/auth/register */
export const registerUser = async (data) => {
  const res = await api.post('/auth/register', data);
  return res.data; // { success, token, user }
};

/** POST /api/auth/login */
export const loginUser = async (data) => {
  const res = await api.post('/auth/login', data);
  return res.data; // { success, token, user }
};

/** POST /api/auth/forgot-password */
export const forgotPassword = async (email) => {
  const res = await api.post('/auth/forgot-password', { email });
  return res.data;
};

/** GET /api/auth/profile */
export const getProfile = async () => {
  const res = await api.get('/auth/profile');
  return res.data; // { success, user }
};

/** GET /api/auth/admins */
export const getAdmins = async () => {
  const res = await api.get('/auth/admins');
  return res.data;
};
