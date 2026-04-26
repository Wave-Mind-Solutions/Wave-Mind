import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, LogOut, User, Sun, Moon, Sparkles,
  Home, Info, Briefcase, Mail, ChevronRight,
  Zap, Shield, Globe, Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const links = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Services', path: '/services', icon: Briefcase },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <>
      {/* Top Progress-like Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 z-[60] shadow-[0_0_15px_rgba(37,99,235,0.5)]" />

      <nav aria-label="Main navigation" className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${isScrolled ? 'py-3' : 'py-5'}`}>
        {/* Obsidian Glass Background */}
        <div className={`absolute inset-0 transition-all duration-700 ${isScrolled
            ? 'bg-white/70 dark:bg-[#0a0c14]/80 backdrop-blur-2xl border-b border-gray-200/50 dark:border-white/5 shadow-2xl'
            : 'bg-transparent'
          }`} />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 group shrink-0"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-all duration-300">
                  <img src="/logo.png" alt="WaveMind Logo" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">WaveMind</span>
                <span className="text-[9px] font-bold text-blue-500 tracking-[0.2em] mt-1">SOLUTIONS</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2 p-1.5 bg-gray-100/50 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-white/5">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 group ${isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navGlow"
                        className="absolute inset-0 bg-white dark:bg-white/10 rounded-xl shadow-sm border border-gray-200/50 dark:border-white/10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <link.icon size={16} className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:scale-110 transition-all duration-300 group"
              >
                <AnimatePresence mode="wait">
                  {theme === 'dark' ? (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <Sun size={20} />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <Moon size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {user ? (
                <div className="relative group">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
                    className="flex items-center gap-3 p-1 pr-4 rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 hover:border-blue-500/30 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {user.fullName.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {user.fullName.split(' ')[0]}
                    </span>
                  </button>

                  <AnimatePresence>
                    {activeDropdown === 'user' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 bg-white/90 dark:bg-[#0a0c14]/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden z-[100]"
                      >
                        <div className="px-4 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Logged in as</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            to={user.role === 'developer' ? '/dashboard/dev' : `/dashboard/${user.role}`}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all group"
                          >
                            <Zap size={18} className="group-hover:scale-110 transition-transform" />
                            Portal Overview
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500 hover:text-white transition-all group"
                          >
                            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors px-4"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-black shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                  >
                    Build Now
                  </Link>
                </div>
              )}

              {/* Mobile Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 text-gray-700 dark:text-gray-300"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[80%] max-w-xs bg-white dark:bg-[#0a0c14] shadow-2xl z-[70] border-l border-gray-200 dark:border-white/10 lg:hidden"
            >
              <div className="flex flex-col h-full p-8">
                <div className="flex items-center justify-between mb-12">
                  <span className="text-xl font-black italic bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">WM.</span>
                  <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4 flex-1">
                  {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all ${isActive
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                          }`}
                      >
                        <link.icon size={24} />
                        {link.name}
                      </Link>
                    );
                  })}
                  
                  {user && (
                    <div className="pt-4 space-y-4">
                      <div className="h-px bg-gray-100 dark:bg-white/5 my-4" />
                      <Link
                        to={user.role === 'developer' ? '/dashboard/dev' : `/dashboard/${user.role}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 p-4 rounded-2xl text-lg font-bold text-blue-600 dark:text-blue-400 bg-blue-500/5 border border-blue-500/10"
                      >
                        <Zap size={24} />
                        Portal Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 w-full p-4 rounded-2xl text-lg font-bold text-red-500 hover:bg-red-500/5 transition-all"
                      >
                        <LogOut size={24} />
                        Terminate Session
                      </button>
                    </div>
                  )}
                </div>

                {!user && (
                  <div className="space-y-4 pt-8 border-t border-gray-100 dark:border-white/5">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full py-4 rounded-2xl text-lg font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/5"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full py-4 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
};

export default Navbar;