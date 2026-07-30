import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTE_PATHS, buildPath } from './routePaths';
import Loader from '@/components/ui/Loader';

/**
 * ProtectedRoute – protects routes that require authentication.
 * Optionally checks for a required role.
 * Redirects to login if not authenticated (preserving intended URL).
 * Redirects to /403 if authenticated but lacking required role.
 */
export default function ProtectedRoute({ requiredRole }) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader isFullPage />;
  }

  if (!isAuthenticated) {
    const redirectTarget = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={buildPath.loginWithRedirect(redirectTarget)}
        replace
        state={{ from: location }}
      />
    );
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to={ROUTE_PATHS.FORBIDDEN} replace />;
  }

  return <Outlet />;
}
