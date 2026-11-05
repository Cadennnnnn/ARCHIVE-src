
import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types/user';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const { session, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="container py-5 text-center">
        <p>Cargando sesión...</p>
      </main>
    );
  }

  if (!isAuthenticated || !session) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(session.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
