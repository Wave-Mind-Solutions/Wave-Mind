/**
 * Chat Service  –  /api/chat/*
 */
import api from './api';

/** GET /api/chat/conversations */
export const getConversations = async () => {
  const res = await api.get('/chat/conversations');
  return res.data;
};

/** POST /api/chat/messages */
export const sendMessage = async (receiverId, content) => {
  const res = await api.post('/chat/messages', { receiverId, content });
  return res.data;
};

/** GET /api/chat/messages/:conversationId */
export const getMessages = async (conversationId, params = {}) => {
  const res = await api.get(`/chat/messages/${conversationId}`, { params });
  return res.data;
};
