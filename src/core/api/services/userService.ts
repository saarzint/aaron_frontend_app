import apiClient from '../apiClient';
import type { UserMock } from '@mocks/data';
import type { TableParams, TableResponse } from '@platform-ui/table';

export type { UserMock };

export const getUsersTable = async (params: TableParams): Promise<TableResponse<UserMock>> => {
  const response = await apiClient.get<UserMock[]>('/users');
  let data = [...response.data];

  if (params.search) {
    const q = params.search.toLowerCase();
    data = data.filter(
      (u) =>
        u.id.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q)
    );
  }

  if (params.sortBy) {
    const key = params.sortBy as keyof UserMock;
    data.sort((a, b) => {
      const av = String(a[key] ?? '');
      const bv = String(b[key] ?? '');
      const cmp = av.localeCompare(bv);
      return params.sortDir === 'desc' ? -cmp : cmp;
    });
  }

  const total = data.length;
  const start = (params.page - 1) * params.pageSize;
  return { data: data.slice(start, start + params.pageSize), total };
};
