import type { Order } from '@core/api/services/orderService';

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
