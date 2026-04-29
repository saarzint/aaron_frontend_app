import type { AxiosResponse } from 'axios';
import apiClient from '../api/apiClient';
import { clearSession, getRefreshToken } from './tokenStorage';

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
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface RefreshResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> =>
  apiClient
    .post<AuthResponse>('/login', credentials)
    .then((res: AxiosResponse<AuthResponse>) => res.data);

export const refresh = async (): Promise<RefreshResponse> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');
  return apiClient
    .post<RefreshResponse>('/refresh', { refreshToken })
    .then((res: AxiosResponse<RefreshResponse>) => res.data);
};

export const logout = (): void => {
  clearSession();
};
