import { http, HttpResponse } from 'msw';
import { mockOrders } from './data';

const ACCESS_TTL_SECONDS = 60 * 15;
const REFRESH_TOKEN_PREFIX = 'mock-refresh-';
const ACCESS_TOKEN_PREFIX = 'mock-access-';

const getRoleByEmail = (email: string): string => {
  if (email.includes('admin')) return 'super_admin';
  if (email.includes('org')) return 'org_admin';
  return 'user';
};

const issueTokens = (email: string) => ({
  token: `${ACCESS_TOKEN_PREFIX}${Date.now()}`,
  refreshToken: `${REFRESH_TOKEN_PREFIX}${email}`,
  expiresIn: ACCESS_TTL_SECONDS,
});

const requireAuth = (request: Request): Response | null => {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  return null;
};

export const handlers = [
  http.post('/api/login', async ({ request }) => {
    const { email } = (await request.json()) as { email: string; password: string };
    return HttpResponse.json({
      ...issueTokens(email),
      user: { id: '1', email, role: getRoleByEmail(email) },
    });
  }),

  http.post('/api/refresh', async ({ request }) => {
    const { refreshToken } = (await request.json()) as { refreshToken?: string };
    if (!refreshToken || !refreshToken.startsWith(REFRESH_TOKEN_PREFIX)) {
      return HttpResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
    }
    const email = refreshToken.slice(REFRESH_TOKEN_PREFIX.length);
    return HttpResponse.json(issueTokens(email));
  }),

  http.get('/api/orders', ({ request }) => {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;
    return HttpResponse.json(mockOrders);
  }),

  http.post('/api/upload', ({ request }) => {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;
    return HttpResponse.json({ success: true, url: 'mock-file-url' });
  }),
];
