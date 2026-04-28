import axios, { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const tenantId = localStorage.getItem('tenantId') ?? 'default';

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['X-Tenant-Id'] = tenantId;

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const normalized: ApiError = {
      message: (error.response?.data as { message?: string })?.message ?? error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(normalized);
  }
);

export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default apiClient;
