import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTE_PATHS, buildPath } from './routePaths';
import Loader from '@/components/ui/Loader';

/**
 * AdminRoute – protects admin-only routes.
 * Redirects to login if not authenticated.
 * Redirects to /403 if authenticated but not ADMIN.
 * Preserves intended URL for post-login redirect.
 */
export default function AdminRoute() {
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

  if (role !== 'ADMIN') {
    return <Navigate to={ROUTE_PATHS.FORBIDDEN} replace />;
  }

  return <Outlet />;
}
