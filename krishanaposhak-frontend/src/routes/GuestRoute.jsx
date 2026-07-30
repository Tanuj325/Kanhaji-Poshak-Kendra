import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTE_PATHS } from './routePaths';
import { isAdmin } from '@/utils/roleChecker';
import Loader from '@/components/ui/Loader';

export default function GuestRoute() {
  const { isAuthenticated, isLoading, user, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader isFullPage />;
  }

  if (isAuthenticated && user) {
    const searchParams = new URLSearchParams(location.search);
    const redirectParam = searchParams.get('redirect');
    const fromState = location.state?.from?.pathname;
    const redirectTo = redirectParam || fromState || ROUTE_PATHS.HOME;

    if (isAdmin(role || user.role) && !String(redirectTo).startsWith('/admin')) {
      return <Navigate to={ROUTE_PATHS.ADMIN} replace />;
    }

    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
