import apiClient from '../api/apiClient';
import { clearToken } from './tokenStorage';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string | number;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> =>
  apiClient.post<AuthResponse>('/login', credentials).then((res) => res.data);

export const logout = (): void => {
  clearToken();
};
