/**
 * Auth Context
 * Provides user state, login/logout, and auto-login from localStorage
 * across the entire app.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getProfile } from '../services/authService';
import { connectSocket, disconnectSocket } from '../services/SocketService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true during initial auto-login check

  // ── Persist helpers ────────────────────────────────────────────────────
  const saveSession = (tkn, usr) => {
    localStorage.setItem('wm_token', tkn);
    localStorage.setItem('wm_user', JSON.stringify(usr));
    setToken(tkn);
    setUser(usr);
    connectSocket(usr._id);
  };

  const clearSession = useCallback(() => {
    localStorage.removeItem('wm_token');
    localStorage.removeItem('wm_user');
    setToken(null);
    setUser(null);
    disconnectSocket();
  }, []);

  // ── Auto-login on app load ───────────────────────────────────────────
  useEffect(() => {
    const storedToken = localStorage.getItem('wm_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }
    // Verify token is still valid by hitting /profile
    setToken(storedToken);
    getProfile()
      .then(({ user: u }) => {
        setUser(u);
        connectSocket(u._id);
      })
      .catch(() => {
        // Token expired/invalid
        clearSession();
      })
      .finally(() => setLoading(false));
  }, [clearSession]);

  // ── login ────────────────────────────────────────────────────────────
  const login = async (credentials) => {
    const data = await loginUser(credentials);
    
    if (data.requires2FA) {
      return data; // Return full data so Login.jsx can see requires2FA
    }

    saveSession(data.token, data.user);
    toast.success(`Welcome back, ${data.user.fullName}! 👋`);
    return data;
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    // User must verify OTP before session is saved
    return data;
  };

  // ── logout ───────────────────────────────────────────────────────────
  const logout = () => {
    clearSession();
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, saveSession }}>
      {children}
    </AuthContext.Provider>
  );
};

/** Hook for easy consumption */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
