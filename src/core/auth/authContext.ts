import { createContext } from 'react';
import type { LoginCredentials, User } from './authService';

export interface AuthContextValue {
  user: User | null;
  role: string | null;
  loginUser: (credentials: LoginCredentials) => Promise<{ role: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
