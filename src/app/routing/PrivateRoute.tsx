import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { getToken } from '@core/auth/tokenStorage';

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
