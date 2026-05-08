import type { Order } from '@core/api/services/orderService';

export interface NotificationMock {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface CustomerMock {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface UserMock {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'invited' | 'suspended';
  lastActive: string;
}

export const mockOrders: Order[] = [
  {
    id: '1',
    status: 'completed',
    customer: 'Alice Johnson',
    total: 149.99,
    createdAt: '2024-01-15',
  },
  { id: '2', status: 'pending', customer: 'Bob Martinez', total: 89.5, createdAt: '2024-01-18' },
  { id: '3', status: 'processing', customer: 'Carol Smith', total: 320.0, createdAt: '2024-01-20' },
  { id: '4', status: 'completed', customer: 'David Lee', total: 54.75, createdAt: '2024-01-22' },
  { id: '5', status: 'cancelled', customer: 'Eva Brown', total: 210.0, createdAt: '2024-01-25' },
  { id: '6', status: 'pending', customer: 'Frank Wilson', total: 99.0, createdAt: '2024-01-27' },
  { id: '7', status: 'completed', customer: 'Grace Kim', total: 430.25, createdAt: '2024-01-29' },
];

export const mockNotifications: NotificationMock[] = [
  {
    id: '1',
    title: 'Order Updated',
    message: 'Order #12345 has been shipped',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    type: 'info',
  },
  {
    id: '2',
    title: 'New Customer',
    message: 'New customer registered: ACME Corp',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: true,
    type: 'success',
  },
  {
    id: '3',
    title: 'System Alert',
    message: 'Scheduled maintenance window: 2:00 AM - 3:00 AM UTC',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    type: 'warning',
  },
];

export const mockCustomers: CustomerMock[] = [
  {
    id: 'C-101',
    name: 'Alice Johnson',
    email: 'alice@northwind.test',
    company: 'Northwind Traders',
    status: 'active',
  },
  {
    id: 'C-102',
    name: 'Bob Martinez',
    email: 'bob@contoso.test',
    company: 'Contoso Retail',
    status: 'pending',
  },
  {
    id: 'C-103',
    name: 'Carol Smith',
    email: 'carol@fabrikam.test',
    company: 'Fabrikam',
    status: 'inactive',
  },
];

export const mockUsers: UserMock[] = [
  {
    id: 'U-201',
    name: 'Admin User',
    email: 'admin@acme.test',
    role: 'super_admin',
    status: 'active',
    lastActive: '2 minutes ago',
  },
  {
    id: 'U-202',
    name: 'Org Manager',
    email: 'manager@acme.test',
    role: 'org_admin',
    status: 'invited',
    lastActive: 'Never',
  },
  {
    id: 'U-203',
    name: 'Workspace User',
    email: 'user@acme.test',
    role: 'user',
    status: 'suspended',
    lastActive: '3 days ago',
  },
];
