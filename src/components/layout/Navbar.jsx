import { useState, useEffect, useCallback, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, LogOut, Sun, Moon,
  Home, Info, Briefcase, Mail,
  Zap, Sparkles, FolderGit2, Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

// Static — defined once outside component, never reallocated on re-renders
const NAV_LINKS = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Agentic AI', path: '/agent-ai', icon: Sparkles, badge: 'AI' },
  { name: 'Projects', path: '/projects', icon: FolderGit2 },
  { name: 'Our Team', path: '/team', icon: Users },
  { name: 'About', path: '/about', icon: Info },
  { name: 'Services', path: '/services', icon: Briefcase },
  { name: 'Contact', path: '/contact', icon: Mail },
];

const Navbar = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Passive scroll listener — doesn't block scroll gesture
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const handleLogout = useCallback(() => {
    logout();
    setIsOpen(false);
    navigate('/login');
  }, [logout, navigate]);

  const toggleMenu = useCallback(() => setIsOpen(v => !v), []);

  return (
    <>
      {/* Top Accent Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 z-[60] shadow-[0_0_15px_rgba(37,99,235,0.5)]" />

      <nav aria-label="Main navigation" className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-2.5' : 'py-3.5 sm:py-4'}`}>
        {/* Glass Background */}
        <div className={`absolute inset-0 transition-all duration-300 ${isScrolled
            ? 'bg-white/80 dark:bg-[#0a0c14]/85 backdrop-blur-2xl border-b border-gray-200/60 dark:border-white/5 shadow-xl'
            : 'bg-transparent'
          }`} />

        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          <div className="flex items-center justify-between gap-2 sm:gap-4">

            {/* Left Column: Logo & Brand (flex-1 to balance right side) */}
            <div className="flex items-center justify-start flex-1 min-w-0">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-600/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-all duration-300">
                    <img src="/logo.png" alt="WaveMind Logo" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">WaveMind</span>
                  <span className="text-[8.5px] sm:text-[9px] font-bold text-blue-500 tracking-[0.2em] mt-1">SOLUTIONS</span>
                </div>
              </Link>
            </div>

            {/* Center Column: Desktop Navigation (perfectly centered) */}
            <div className="hidden lg:flex items-center justify-center flex-shrink-0">
              <div className="flex items-center gap-0.5 xl:gap-1 p-1 bg-gray-100/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-white/5 shadow-sm">
                {NAV_LINKS.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`relative px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-xl text-xs xl:text-[13px] font-semibold transition-all duration-200 flex items-center gap-1.5 group whitespace-nowrap ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="navGlow"
                          className="absolute inset-0 bg-white dark:bg-white/10 rounded-xl shadow-sm border border-gray-200/60 dark:border-white/10"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                      <link.icon size={15} className={`relative z-10 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'} ${link.badge ? 'text-purple-500 dark:text-purple-400' : ''}`} />
                      <span className="relative z-10">{link.name}</span>
                      {link.badge && (
                        <span className="relative z-10 px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md shadow-sm">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Actions & Controls (flex-1 to balance left side) */}
            <div className="flex items-center justify-end flex-1 gap-2 sm:gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle color theme"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-gray-100/60 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:scale-105 active:scale-95 transition-all duration-200 group shrink-0"
              >
                <AnimatePresence mode="wait">
                  {theme === 'dark' ? (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <Sun size={18} />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <Moon size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {user ? (
                <div className="relative group shrink-0">
                  <button
                    onClick={() => {}}
                    className="flex items-center gap-2 sm:gap-2.5 p-1 pr-3 sm:pr-3.5 rounded-xl bg-gray-100/60 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 hover:border-blue-500/30 transition-all"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                      {user.fullName.charAt(0)}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {user.fullName.split(' ')[0]}
                    </span>
                  </button>

                  <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-[#0a0c14]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden z-[100] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Logged in as</p>
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user.email}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link
                        to={user.role === 'developer' ? '/dashboard/dev' : `/dashboard/${user.role}`}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all group"
                      >
                        <Zap size={16} className="group-hover:scale-110 transition-transform" />
                        Portal Overview
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500 hover:text-white transition-all group"
                      >
                        <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                  <Link
                    to="/login"
                    className="hidden xl:inline-flex items-center px-3.5 xl:px-4 py-2 rounded-xl text-xs xl:text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/60 dark:hover:bg-white/5 border border-transparent hover:border-gray-200/60 dark:hover:border-white/5 transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-flex items-center px-3.5 sm:px-4 xl:px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs xl:text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Toggle */}
              <button
                onClick={toggleMenu}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-gray-100/60 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:scale-105 active:scale-95 transition-all shrink-0"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
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
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-xs bg-white dark:bg-[#0a0c14] shadow-2xl z-[70] border-l border-gray-200 dark:border-white/10 lg:hidden overflow-y-auto"
            >
              <div className="flex flex-col min-h-full p-6 sm:p-8">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="WaveMind Logo" className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-lg font-bold text-gray-900 dark:text-white">WaveMind</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close navigation"
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-2 flex-1">
                  {NAV_LINKS.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <link.icon size={18} className={isActive ? 'text-white' : link.badge ? 'text-purple-500 dark:text-purple-400' : 'text-gray-400'} />
                        <span className="flex-1">{link.name}</span>
                        {link.badge && (
                          <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md shadow-sm ${isActive ? 'bg-white/20 text-white' : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'}`}>
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}

                  {user && (
                    <div className="pt-3 space-y-2">
                      <div className="h-px bg-gray-100 dark:bg-white/5 my-3" />
                      <Link
                        to={user.role === 'developer' ? '/dashboard/dev' : `/dashboard/${user.role}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/5 border border-blue-500/10"
                      >
                        <Zap size={18} />
                        Portal Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-500/5 transition-all"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>

                {!user && (
                  <div className="space-y-2.5 pt-6 mt-6 border-t border-gray-100 dark:border-white/5">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-semibold text-gray-800 dark:text-white bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 hover:bg-gray-200/60 dark:hover:bg-white/10 transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md hover:shadow-blue-500/30 transition-all"
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

      {/* Spacer matching fixed navbar height */}
      <div className="h-16 sm:h-[72px]" />
    </>
  );
});

export default Navbar;