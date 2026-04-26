import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart,
  Layout,
  Users,
  Settings,
  LogOut,
  PlusCircle,
  List,
  MessageSquare,
  CreditCard,
  Briefcase,
  FileText,
  Bell,
  Cpu,
  Menu,
  X,
  Upload,
  Sun,
  Moon,
  Zap,
  ChevronRight,
  Search,
  Star,
  Activity,
  Clock
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Sidebar Component
const Sidebar = ({ role, isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { theme } = useTheme();
  const sidebarInitials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'WM';

  const clientLinks = [
    { name: 'Overview', path: '/dashboard/client', icon: Layout, gradient: 'from-blue-500 to-cyan-500', description: 'Dashboard overview' },
    { name: 'Submit Requirement', path: '/dashboard/client/submit', icon: PlusCircle, gradient: 'from-emerald-500 to-teal-500', description: 'New project request' },
    { name: 'My Projects', path: '/dashboard/client/projects', icon: Briefcase, gradient: 'from-purple-500 to-pink-500', description: 'Active projects' },
    { name: 'Communication', path: '/dashboard/client/chat', icon: MessageSquare, gradient: 'from-indigo-500 to-blue-500', description: 'Live support' },
    // { name: 'Payments', path: '/dashboard/client/payments', icon: CreditCard, gradient: 'from-green-500 to-emerald-500', description: 'Billing & invoices' },
  ];

  const adminLinks = [
    { name: 'Control Center', path: '/dashboard/admin', icon: BarChart, gradient: 'from-red-500 to-orange-500', description: 'Analytics & metrics' },
    { name: 'Client Requirements', path: '/dashboard/admin/requirements', icon: List, gradient: 'from-amber-500 to-yellow-500', description: 'Review submissions' },
    { name: 'Active Monitoring', path: '/dashboard/admin/projects', icon: Briefcase, gradient: 'from-lime-500 to-green-500', description: 'Track progress' },
    { name: 'Specialist Units', path: '/dashboard/admin/team', icon: Users, gradient: 'from-cyan-500 to-blue-500', description: 'Team management' },
    { name: 'Asset Repository', path: '/dashboard/admin/assets', icon: Upload, gradient: 'from-pink-500 to-rose-500', description: 'Digital assets' },
    { name: 'Direct Chat', path: '/dashboard/admin/chat', icon: MessageSquare, gradient: 'from-sky-500 to-indigo-500', description: 'Team chat' },
  ];

  const devLinks = [
    { name: 'Dashboard', path: '/dashboard/dev', icon: Layout, gradient: 'from-violet-500 to-purple-500', description: 'Task overview' },
    { name: 'Assigned Projects', path: '/dashboard/dev/projects', icon: Briefcase, gradient: 'from-fuchsia-500 to-pink-500', description: 'My tasks' },
    { name: 'Deliverables Repository', path: '/dashboard/dev/tools', icon: Upload, gradient: 'from-rose-500 to-red-500', description: 'Submit work' },
    { name: 'Direct Messages', path: '/dashboard/dev/chat', icon: MessageSquare, gradient: 'from-blue-500 to-indigo-500', description: 'Team chat' },
  ];

  const links = role === 'admin' ? adminLinks : (role === 'dev' || role === 'developer') ? devLinks : clientLinks;

  const sidebarContent = (
    <div className={`flex flex-col h-full bg-white dark:bg-[#1e293b] border-r border-gray-200 dark:border-white/5 transition-colors duration-500`}>
      {/* Logo Section */}
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.6, ease: "anticipate" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-600/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-gray-800 dark:to-black border border-blue-500/20 dark:border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">

              {/* YOUR LOGO IMAGE */}
              <img
                src="/logo.png"
                alt="WaveMind Logo"
                className="w-6 h-6 object-contain"
              />

            </div>
          </motion.div>

          <div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight block leading-tight">
              WAVE<span className="text-blue-500">MIND</span>
            </span>
            <span className="text-[8px] font-semibold text-blue-600 dark:text-gray-500 uppercase tracking-wider mt-1 block opacity-60">
              Enterprise Matrix
            </span>
          </div>
        </Link>
      </div>

      {/* User Status */}
      <div className="px-6 py-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-600/5 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-gray-50 dark:bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-gray-100 dark:border-white/5 hover:border-blue-500/20 transition-all">
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-2xl">
                  {sidebarInitials}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1e293b] shadow-lg animate-pulse" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.fullName || 'User'}</p>
                <p className="text-[9px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5">{user?.role || role || 'User'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-4 mb-4">
          <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider flex items-center gap-2">
            <div className="w-1 h-1 bg-blue-500 rounded-full" />
            System Nodes
          </span>
        </div>
        {links.map((link, index) => {
          const isActive = location.pathname === link.path;
          return (
            <motion.div
              key={link.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`relative group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                  ? 'bg-blue-600/10 dark:bg-white/10 text-blue-600 dark:text-white border border-blue-600/20 dark:border-white/10 shadow-lg'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
              >
                {isActive && (
                  <motion.div layoutId="activeGlow" className="absolute left-0 w-1 h-5 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                )}
                <div className={`transition-all duration-300 ${isActive ? 'text-blue-500 dark:text-blue-400 scale-105' : 'group-hover:text-gray-700 dark:group-hover:text-gray-300 group-hover:scale-105'}`}>
                  <link.icon size={18} />
                </div>
                <span className={`text-sm font-semibold tracking-tight ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                  {link.name}
                </span>
                {isActive && (
                  <ChevronRight size={12} className="ml-auto text-blue-500/50" />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-100 dark:border-white/5 space-y-3">
        <button
          onClick={() => { logout(); setIsOpen(false); }}
          className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all group w-full border border-transparent hover:border-red-500/20"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          Terminate Session
        </button>

        <div className="text-center">
          <p className="text-[8px] font-semibold text-gray-400 dark:text-gray-700 uppercase tracking-wider">WaveMind v3.5.0 Matrix</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 fixed left-0 top-0 bottom-0 z-40 shadow-2xl transition-all duration-500">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[85%] max-w-sm z-50 shadow-2xl lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Header Component
const Header = ({ title, setIsSidebarOpen }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'WM';
  const [notifications, setNotifications] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const notificationList = [
    { id: 1, title: 'Project Update', time: '2 mins ago', read: false },
    { id: 2, title: 'New Message', time: '1 hour ago', read: false },
    { id: 3, title: 'Budget Approved', time: '5 hours ago', read: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-6 md:px-8 py-4 transition-colors duration-500">
      <div className="flex items-center justify-between max-w-[1400px] mx-auto">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
          >
            <Menu size={20} />
          </button>

          <div className="hidden lg:block">
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-bold text-gray-900 dark:text-white tracking-tight"
            >
              {title}
            </motion.h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-2 min-w-[260px] group focus-within:border-blue-500/50 focus-within:bg-white/10 transition-all">
            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search matrix..."
              className="bg-transparent border-none outline-none text-sm ml-3 flex-1 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium tracking-tight"
            />
            <kbd className="hidden lg:inline text-[8px] font-bold text-gray-400 dark:text-gray-600 bg-white dark:bg-black px-2 py-1 rounded border border-gray-200 dark:border-white/5 uppercase tracking-wider">⌘K</kbd>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-600 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all shadow-lg"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
            >
              <Bell size={16} />
              {notifications > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-[8px] text-white font-bold flex items-center justify-center"
                >
                  {notifications}
                </motion.div>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowNotifications(false)}
                    className="fixed inset-0 z-40"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-gray-200 dark:border-gray-800">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
                        <span className="text-[10px] font-semibold text-blue-600 cursor-pointer">Mark all read</span>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notificationList.map(notif => (
                        <div key={notif.id} className={`p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-500/5 dark:bg-primary-500/5' : ''}`}>
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-primary-500/20 flex items-center justify-center">
                              <Star className="w-3 h-3 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-gray-900 dark:text-white">{notif.title}</p>
                              <p className="text-[10px] text-gray-500 mt-0.5">{notif.time}</p>
                            </div>
                            {!notif.read && (
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-white/5">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-semibold text-gray-900 dark:text-white tracking-tight">{user?.fullName || 'Guest User'}</p>
              <p className="text-[9px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5">{user?.role || 'User'}</p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-blue-600/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-black border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-white font-bold text-xs shadow-2xl">
                {initials}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Main Dashboard Layout
const DashboardLayout = ({ children, role, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const { user } = useAuth();
  const effectiveRole = role || user?.role;

  return (
    <div className={`relative min-h-screen ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gray-50'} transition-colors duration-500 overflow-x-hidden selection:bg-blue-500/30`}>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.05),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(79,70,229,0.05),_transparent_40%)] pointer-events-none" />

      <Sidebar role={effectiveRole} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="lg:ml-72 min-h-screen flex flex-col relative z-10">
        <Header title={title || 'Matrix Core'} setIsSidebarOpen={setIsSidebarOpen} />

        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[1400px] mx-auto"
          >
            {children}
          </motion.div>
        </main>

        <footer className={`border-t ${theme === 'dark' ? 'border-white/5 bg-[#0f172a]/50' : 'border-gray-200 bg-white/50'} backdrop-blur-md py-5 px-8 transition-colors duration-500`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
            <div className="flex items-center gap-4">
              <span>© 2026 WAVEMIND CORE</span>
              <div className="w-1 h-1 bg-gray-200 dark:bg-gray-800 rounded-full" />
              <span className="text-blue-500/60">SECURED MATRIX PROTOCOL</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Direct Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;