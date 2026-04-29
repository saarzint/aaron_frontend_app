import { http, HttpResponse } from 'msw';
import { mockOrders } from './data';

const getRoleByEmail = (email: string): string => {
  if (email.includes('admin')) return 'super_admin';
  if (email.includes('org')) return 'org_admin';
  return 'user';
};

export const handlers = [
  http.post('/api/login', async ({ request }) => {
    const { email } = (await request.json()) as { email: string; password: string };
    return HttpResponse.json({
      token: 'mock-token-123',
      user: { id: '1', email, role: getRoleByEmail(email) },
    });
  }),

  http.get('/api/orders', () => {
    return HttpResponse.json(mockOrders);
  }),

  http.post('/api/upload', () => {
    return HttpResponse.json({ success: true, url: 'mock-file-url' });
  }),
];
