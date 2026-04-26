/**
 * ProtectedRoute
 * Redirects to /login if not authenticated.
 * Redirects to correct dashboard if role doesn't match.
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_HOME = {
  client: '/dashboard/client',
  admin: '/dashboard/admin',
  developer: '/dashboard/dev',
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // While checking localStorage/token, show nothing (or a spinner)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User is logged in but wrong role — redirect to their actual dashboard
    return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;
