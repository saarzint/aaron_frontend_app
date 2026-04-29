import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { getToken, getRole, isSessionExpired } from '@core/auth/tokenStorage';

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ROLE_HOME: Record<string, string> = {
  super_admin: '/dashboard/admin',
  org_admin: '/dashboard/org',
  user: '/dashboard/user',
};

export default function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const token = getToken();
  if (!token || isSessionExpired()) return <Navigate to="/login" replace />;

  if (allowedRoles && allowedRoles.length > 0) {
    const role = getRole();
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to={role ? (ROLE_HOME[role] ?? '/login') : '/login'} replace />;
    }
  }

  return <>{children}</>;
}
