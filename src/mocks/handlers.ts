import { http, HttpResponse } from 'msw';
import { mockCustomers, mockOrders, mockUsers, type CustomerMock, type UserMock } from './data';

const ACCESS_TTL_SECONDS = 60 * 15;
const REFRESH_TOKEN_PREFIX = 'mock-refresh-';
const ACCESS_TOKEN_PREFIX = 'mock-access-';
let customers: CustomerMock[] = [...mockCustomers];
let users: UserMock[] = [...mockUsers];

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

  http.get('/api/customers', ({ request }) => {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;
    return HttpResponse.json(customers);
  }),

  http.post('/api/customers', async ({ request }) => {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;

    const body = (await request.json()) as Partial<CustomerMock> & Record<string, unknown>;
    const newCustomer: CustomerMock = {
      id: crypto.randomUUID(),
      name: String(body.name ?? ''),
      email: String(body.email ?? ''),
      company: String(body.company ?? ''),
      status: (body.status as CustomerMock['status']) ?? 'active',
    };

    customers = [newCustomer, ...customers];
    return HttpResponse.json(newCustomer, { status: 201 });
  }),

  http.put('/api/customers/:id', async ({ params, request }) => {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;

    const body = (await request.json()) as Partial<CustomerMock> & Record<string, unknown>;
    const id = String(params.id ?? '');
    const updatedCustomer: CustomerMock = {
      id,
      name: String(body.name ?? ''),
      email: String(body.email ?? ''),
      company: String(body.company ?? ''),
      status: (body.status as CustomerMock['status']) ?? 'active',
    };

    customers = customers.map((customer) => (customer.id === id ? updatedCustomer : customer));
    return HttpResponse.json(updatedCustomer);
  }),

  http.delete('/api/customers/:id', ({ params, request }) => {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;

    const id = String(params.id ?? '');
    customers = customers.filter((customer) => customer.id !== id);
    return HttpResponse.json({ deleted: true, id });
  }),

  http.get('/api/users', ({ request }) => {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;
    return HttpResponse.json(users);
  }),

  http.post('/api/users', async ({ request }) => {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;

    const body = (await request.json()) as Partial<UserMock> & Record<string, unknown>;
    const newUser: UserMock = {
      id: crypto.randomUUID(),
      name: String(body.name ?? ''),
      email: String(body.email ?? ''),
      role: String(body.role ?? 'user'),
      status: (body.status as UserMock['status']) ?? 'invited',
      lastActive: 'Just now',
    };

    users = [newUser, ...users];
    return HttpResponse.json(newUser, { status: 201 });
  }),

  http.put('/api/users/:id', async ({ params, request }) => {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;

    const body = (await request.json()) as Partial<UserMock> & Record<string, unknown>;
    const id = String(params.id ?? '');
    const existing = users.find((entry) => entry.id === id);
    const updatedUser: UserMock = {
      id,
      name: String(body.name ?? existing?.name ?? ''),
      email: String(body.email ?? existing?.email ?? ''),
      role: String(body.role ?? existing?.role ?? 'user'),
      status: (body.status as UserMock['status']) ?? existing?.status ?? 'invited',
      lastActive: existing?.lastActive ?? 'Just now',
    };

    users = users.map((entry) => (entry.id === id ? updatedUser : entry));
    return HttpResponse.json(updatedUser);
  }),

  http.post('/api/upload', ({ request }) => {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;
    return HttpResponse.json({ success: true, url: 'mock-file-url' });
  }),
];
