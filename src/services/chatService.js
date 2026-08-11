/**
 * Chat Service
 * API client for WaveMind AI Sales Assistant
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('wavemind_token') || sessionStorage.getItem('wavemind_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Send guest chat message (stateless backend proxy, zero MongoDB storage)
 */
export const sendGuestChatMessage = async (messages) => {
  const response = await axios.post(`${API_BASE_URL}/chat/guest/message`, { messages });
  return response.data;
};

/**
 * Get or create active AI Sales Assistant conversation for logged-in user
 */
export const getOrCreateConversation = async (title = 'Sales Assistant Chat', metadata = {}) => {
  const response = await axios.post(
    `${API_BASE_URL}/chat/conversations`,
    { title, metadata },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

/**
 * Fetch authenticated user's conversations
 */
export const getUserConversations = async () => {
  const response = await axios.get(`${API_BASE_URL}/chat/conversations`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Aliases & P2P Direct Messaging exports
export const getConversations = async () => {
  const response = await axios.get(`${API_BASE_URL}/chat/p2p/conversations`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const getMessages = async (conversationId) => {
  const response = await axios.get(`${API_BASE_URL}/chat/p2p/messages/${conversationId}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const sendMessage = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/chat/p2p/messages`, data, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Fetch single conversation by ID (IDOR Protected)
 */
export const getConversationById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/chat/conversations/${id}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Send message in authenticated conversation and receive AI reply
 */
export const sendAuthChatMessage = async (conversationId, content, metadata = {}) => {
  const response = await axios.post(
    `${API_BASE_URL}/chat/conversations/${conversationId}/messages`,
    { content, metadata },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

/**
 * Delete a conversation by ID
 */
export const deleteConversation = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/chat/conversations/${id}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};
