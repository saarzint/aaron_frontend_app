import { useEffect, useState, type ReactNode } from 'react';
import { login, logout as logoutService, type LoginCredentials, type User } from './authService';
import { AuthContext } from './authContext';
import {
  clearSession,
  getEmail as getStoredEmail,
  getRole as getStoredRole,
  getToken,
  isSessionExpired,
  setEmail as storeEmail,
  setExpiresAt,
  setRefreshToken,
  setRole as storeRole,
  setToken,
} from './tokenStorage';
import { SESSION_EXPIRED_EVENT } from '../api/apiClient';

const mockRoleByEmail = (email: string): string => {
  if (email.includes('admin')) return 'super_admin';
  if (email.includes('org')) return 'org_admin';
  return 'user';
};

const initialUser = (): User | null => {
  if (!getToken() || isSessionExpired()) {
    if (isSessionExpired()) clearSession();
    return null;
  }
  return { id: '', email: getStoredEmail() ?? '', role: getStoredRole() ?? undefined };
};

const initialRole = (): string | null => {
  if (!getToken() || isSessionExpired()) return null;
  return getStoredRole();
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [role, setRole] = useState<string | null>(initialRole);

  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      setRole(null);
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, []);

  const loginUser = async (credentials: LoginCredentials) => {
    const { token, refreshToken, expiresIn, user: authUser } = await login(credentials);
    const assignedRole = authUser.role ?? mockRoleByEmail(credentials.email);
    setToken(token);
    setRefreshToken(refreshToken);
    setExpiresAt(Date.now() + expiresIn * 1000);
    storeRole(assignedRole);
    storeEmail(authUser.email);
    setUser({ ...authUser, role: assignedRole });
    setRole(assignedRole);
    return { role: assignedRole };
  };

  const logoutUser = () => {
    logoutService();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loginUser, logout: logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
