import apiClient from '../apiClient';
import type { TableParams, TableResponse } from '@platform-ui/table';

export interface Order {
  id: string;
  status: string;
  customer: string;
  total: number;
  createdAt: string;
}

export const getOrders = async (): Promise<Order[]> =>
  apiClient.get<Order[]>('/orders').then((res) => res.data);

export const getOrdersTable = async (params: TableParams): Promise<TableResponse<Order>> => {
  const all = await getOrders();

  let filtered = [...all];

  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q) ||
        String(o.total).includes(q)
    );
  }

  if (params.sortBy) {
    const key = params.sortBy as keyof Order;
    filtered.sort((a, b) => {
      const av = String(a[key] ?? '');
      const bv = String(b[key] ?? '');
      const cmp = av.localeCompare(bv, undefined, { numeric: true });
      return params.sortDir === 'desc' ? -cmp : cmp;
    });
  }

  const total = filtered.length;
  const start = (params.page - 1) * params.pageSize;
  return { data: filtered.slice(start, start + params.pageSize), total };
};
