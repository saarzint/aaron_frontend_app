export const getToken = () => localStorage.getItem('token');
export const setToken = (token: string) => localStorage.setItem('token', token);
export const clearToken = () => localStorage.removeItem('token');

export const getRole = () => localStorage.getItem('role');
export const setRole = (role: string) => localStorage.setItem('role', role);
export const clearRole = () => localStorage.removeItem('role');
