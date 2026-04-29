import { useState, type ReactNode } from 'react';
import { login, logout as logoutService, type LoginCredentials, type User } from './authService';
import { AuthContext } from './authContext';
import {
  getToken,
  setToken,
  getRole as getStoredRole,
  setRole as storeRole,
  clearRole,
} from './tokenStorage';

const mockRoleByEmail = (email: string): string => {
  if (email.includes('admin')) return 'super_admin';
  if (email.includes('org')) return 'org_admin';
  return 'user';
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (!getToken()) return null;
    return { id: '', email: 'restored-user', role: getStoredRole() ?? undefined };
  });

  const [role, setRole] = useState<string | null>(() => (getToken() ? getStoredRole() : null));

  const loginUser = async (credentials: LoginCredentials) => {
    const { token, user: authUser } = await login(credentials);
    const assignedRole = authUser.role ?? mockRoleByEmail(credentials.email);
    setToken(token);
    storeRole(assignedRole);
    setUser({ ...authUser, role: assignedRole });
    setRole(assignedRole);
    return { role: assignedRole };
  };

  const logoutUser = () => {
    logoutService();
    clearRole();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loginUser, logout: logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
