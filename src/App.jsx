import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, lazy, Suspense } from 'react';
import { useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Auth guard
import ProtectedRoute from './components/ProtectedRoute';

// Chatbot Widget
import ChatbotWidget from './components/ChatbotWidget';

// Loading Fallback Component
const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#050505] z-[9999]">
    <div className="relative">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-600 rounded-full"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary-600 uppercase tracking-widest"
      >
        WM
      </motion.div>
    </div>
  </div>
);

// Lazy Loaded Public Pages
const Home = lazy(() => import('./pages/Home'));
const AgentAI = lazy(() => import('./pages/AgentAI'));
const Projects = lazy(() => import('./pages/Projects'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Leadership = lazy(() => import('./pages/Leadership'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const VerifyOTP = lazy(() => import('./pages/VerifyOTP'));

// Lazy Loaded Client Dashboard
const ClientOverview = lazy(() => import('./pages/dashboard/client/ClientOverview'));
const SubmitRequirement = lazy(() => import('./pages/dashboard/client/SubmitRequirement'));
const ClientProjects = lazy(() => import('./pages/dashboard/client/ClientProjects'));
const ClientChat = lazy(() => import('./pages/dashboard/client/ClientChat'));
const ClientPayments = lazy(() => import('./pages/dashboard/client/ClientPayments'));

// Lazy Loaded Admin Dashboard
const AdminOverview = lazy(() => import('./pages/dashboard/admin/AdminOverview'));
const AdminSubPage = lazy(() => import('./pages/dashboard/admin/AdminSubPage'));
const AdminChat = lazy(() => import('./pages/dashboard/admin/AdminChat'));
const AuditLog = lazy(() => import('./pages/dashboard/admin/AuditLog'));

// Lazy Loaded Developer Dashboard
const DevOverview = lazy(() => import('./pages/dashboard/dev/DevOverview'));
const DevSubPage = lazy(() => import('./pages/dashboard/dev/DevSubPage'));
const DevChat = lazy(() => import('./pages/dashboard/dev/DevChat'));

// Shared Dashboard Pages
const NotificationSettings = lazy(() => import('./pages/dashboard/shared/NotificationSettings'));

// Helper for generic dashboard redirect
const RedirectToDashboard = () => {
  const { user } = useAuth();
  const ROLE_HOME = {
    client: '/dashboard/client',
    admin: '/dashboard/admin',
    developer: '/dashboard/dev',
  };
  return <Navigate to={ROLE_HOME[user?.role] || '/dashboard/client'} replace />;
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {!isDashboard && <Navbar />}
      <main className={`flex-grow ${isDashboard ? 'pt-0' : ''}`}>
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={location.pathname}>
              {/* ── Public Routes ── */}
              <Route path="/" element={<Home />} />
              <Route path="/agent-ai" element={<AgentAI />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/assistant" element={<Navigate to="/agent-ai" replace />} />
              <Route path="/chat" element={<Navigate to="/agent-ai" replace />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/leadership" element={<Leadership />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />

              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['client', 'admin', 'developer']}>
                  <RedirectToDashboard />
                </ProtectedRoute>
              } />

              {/* ── Client Dashboard (role: client) ── */}
              <Route path="/dashboard/client" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientOverview />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/client/submit" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <SubmitRequirement />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/client/projects" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientProjects />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/client/chat" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientChat />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/client/payments" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientPayments />
                </ProtectedRoute>
              } />

              {/* ── Admin Dashboard (role: admin) ── */}
              <Route path="/dashboard/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminOverview />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/admin/requirements" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSubPage title="Requirements Management" type="requirements" />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/admin/projects" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSubPage title="Active Monitoring" type="projects" />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/admin/team" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSubPage title="Specialist Units" type="team" />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/admin/leads" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSubPage title="Chatbot Leads" type="leads" />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/admin/reports" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSubPage title="Financial Reports & Analytics" type="reports" />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/admin/assets" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSubPage title="Project Assets & Repository" type="assets" />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/admin/pricing" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSubPage title="Website Pricing Engine" type="pricing" />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/admin/chat" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminChat />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/admin/audit" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AuditLog />
                </ProtectedRoute>
              } />

              {/* ── Developer Dashboard (role: developer) ── */}
              <Route path="/dashboard/dev" element={
                <ProtectedRoute allowedRoles={['developer']}>
                  <DevOverview />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/dev/projects" element={
                <ProtectedRoute allowedRoles={['developer']}>
                  <DevSubPage title="Assigned Projects Hub" type="projects" />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/dev/tasks" element={
                <ProtectedRoute allowedRoles={['developer']}>
                  <DevSubPage title="Active Task Management" type="tasks" />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/dev/chat" element={
                <ProtectedRoute allowedRoles={['developer']}>
                  <DevChat />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/dev/tools" element={
                <ProtectedRoute allowedRoles={['developer']}>
                  <DevSubPage title="Developer Tools Repository" type="tools" />
                </ProtectedRoute>
              } />

              {/* ── Shared Dashboard Routes ── */}
              <Route path="/settings" element={
                <ProtectedRoute allowedRoles={['client', 'admin', 'developer']}>
                  <NotificationSettings />
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      {!isDashboard && <Footer />}
      {!isDashboard && <ChatbotWidget />}
    </div>
  );
}

export default App;
