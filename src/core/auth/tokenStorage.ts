export const getToken = () => localStorage.getItem('token');
export const setToken = (token: string) => localStorage.setItem('token', token);
export const clearToken = () => localStorage.removeItem('token');

export const getRefreshToken = () => localStorage.getItem('refreshToken');
export const setRefreshToken = (token: string) => localStorage.setItem('refreshToken', token);
export const clearRefreshToken = () => localStorage.removeItem('refreshToken');

export const getRole = () => localStorage.getItem('role');
export const setRole = (role: string) => localStorage.setItem('role', role);
export const clearRole = () => localStorage.removeItem('role');

export const getExpiresAt = (): number | null => {
  const raw = localStorage.getItem('expiresAt');
  return raw ? Number(raw) : null;
};
export const setExpiresAt = (epochMs: number) => localStorage.setItem('expiresAt', String(epochMs));
export const clearExpiresAt = () => localStorage.removeItem('expiresAt');

export const isSessionExpired = (): boolean => {
  const expiresAt = getExpiresAt();
  if (!expiresAt) return false;
  return Date.now() >= expiresAt;
};

export const clearSession = () => {
  clearToken();
  clearRefreshToken();
  clearRole();
  clearExpiresAt();
};
