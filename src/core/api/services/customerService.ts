import { mockCustomers, type CustomerMock } from '@mocks/data';
import type { TableParams, TableResponse } from '@platform-ui/table';

export type { CustomerMock };

export const getCustomersTable = async (
  params: TableParams
): Promise<TableResponse<CustomerMock>> => {
  let data = [...mockCustomers];

  if (params.search) {
    const q = params.search.toLowerCase();
    data = data.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q)
    );
  }

  if (params.sortBy) {
    const key = params.sortBy as keyof CustomerMock;
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
