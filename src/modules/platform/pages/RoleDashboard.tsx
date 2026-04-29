import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Badge, Stack, Title } from '@mantine/core';
import { type ColumnDef } from '@tanstack/react-table';
import { Navigate } from 'react-router-dom';
import AppShell from '@platform-ui/components/AppShell/AppShell';
import DataTable from '@platform-ui/components/DataTable/DataTable';
import { getOrders, type Order } from '@core/api/services/orderService';
import { useAuth } from '@core/auth/useAuth';
import { ROLE_CONFIG, isAppRole } from '../config/moduleRegistry';

const STATUS_COLORS: Record<string, string> = {
  completed: 'green',
  pending: 'yellow',
  processing: 'blue',
  cancelled: 'red',
};

const orderColumns: ColumnDef<Order>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'customer', header: 'Customer' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = String(getValue());
      return <Badge color={STATUS_COLORS[status] ?? 'gray'}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`,
  },
  { accessorKey: 'createdAt', header: 'Created' },
];

export default function RoleDashboard() {
  const { role } = useAuth();
  const config = useMemo(() => (isAppRole(role) ? ROLE_CONFIG[role] : null), [role]);

  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });

  if (!config) return <Navigate to="/login" replace />;

  return (
    <AppShell title={config.title} navItems={config.modules}>
      <Stack gap="md">
        <Title order={3}>Orders</Title>
        {ordersQuery.isError && (
          <Alert color="red" title="Failed to load orders">
            {(ordersQuery.error as { message?: string })?.message ?? 'Unknown error'}
          </Alert>
        )}
        <DataTable
          columns={orderColumns}
          data={ordersQuery.data}
          isLoading={ordersQuery.isLoading}
        />
      </Stack>
    </AppShell>
  );
}
