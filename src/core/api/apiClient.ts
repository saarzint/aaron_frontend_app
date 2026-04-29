import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import {
  clearSession,
  getRefreshToken,
  getToken,
  isSessionExpired,
  setExpiresAt,
  setRefreshToken,
  setToken,
} from '../auth/tokenStorage';

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

export const SESSION_EXPIRED_EVENT = 'auth:session-expired';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  const tenantId = localStorage.getItem('tenantId') ?? 'default';

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['X-Tenant-Id'] = tenantId;

  return config;
});

const emitSessionExpired = () => {
  clearSession();
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
};

interface RefreshShape {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

let refreshInFlight: Promise<RefreshShape> | null = null;

const performRefresh = async (): Promise<RefreshShape> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');
  const res = await axios.post<RefreshShape>('/api/refresh', { refreshToken });
  setToken(res.data.token);
  setRefreshToken(res.data.refreshToken);
  setExpiresAt(Date.now() + res.data.expiresIn * 1000);
  return res.data;
};

interface RetriableConfig extends AxiosRequestConfig {
  _retry?: boolean;
  _skipAuthRefresh?: boolean;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    if (status === 401 && original && !original._retry && !original._skipAuthRefresh) {
      original._retry = true;
      try {
        if (!refreshInFlight) refreshInFlight = performRefresh();
        await refreshInFlight;
        return apiClient(original);
      } catch {
        emitSessionExpired();
      } finally {
        refreshInFlight = null;
      }
    }

    const normalized: ApiError = {
      message: (error.response?.data as { message?: string })?.message ?? error.message,
      status,
      data: error.response?.data,
    };
    return Promise.reject(normalized);
  }
);

export const checkSessionExpiry = (): boolean => {
  if (getToken() && isSessionExpired()) {
    emitSessionExpired();
    return true;
  }
  return false;
};

export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default apiClient;
