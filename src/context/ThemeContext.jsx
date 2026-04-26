import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return 'dark';
  });

  // Sync with user profile
  useEffect(() => {
    if (user?.theme && user.theme !== 'system') {
      setTheme(user.theme);
    } else if (user?.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
    }
  }, [user]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Persist to DB if logged in
    if (user) {
      try {
        const token = localStorage.getItem('wm_token');
        await axios.patch(`${import.meta.env.VITE_API_URL}/auth/settings`, 
          { theme: newTheme },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error('Failed to sync theme with DB:', err);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
