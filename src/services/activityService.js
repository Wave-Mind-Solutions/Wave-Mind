import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/activity`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getAllLogs = async (params = {}) => {
  const response = await axios.get(API_URL, {
    ...getAuthHeader(),
    params
  });
  return response.data;
};

export const getProjectTimeline = async (projectId, params = {}) => {
  const response = await axios.get(`${API_URL}/project/${projectId}`, {
    ...getAuthHeader(),
    params
  });
  return response.data;
};
