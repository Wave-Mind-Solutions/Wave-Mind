/**
 * Real Socket.io client – replaces the simulated SocketService
 * Usage:
 *   import socket from '../socket/socket';
 *   socket.emit('join', { userId });
 *   socket.on('new_message', handler);
 */
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  autoConnect: false,       // connect manually after login
  withCredentials: true,
  transports: ['websocket'], // Force websocket to avoid polling 400 errors
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

/**
 * Connect socket and join the user's personal notification room
 * Call this immediately after login/auto-login
 */
export const connectSocket = (userId) => {
  if (!socket.connected) {
    socket.connect();
    socket.on('connect', () => {
      socket.emit('join', { userId });
      console.log(`🔌 Socket connected (${socket.id}), joined room user_${userId}`);
    });
  }
};

/**
 * Disconnect socket – call on logout
 */
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log('🔌 Socket disconnected');
  }
};

export default socket;
