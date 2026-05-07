import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Stack } from '@mantine/core';
import { type ColumnDef } from '@tanstack/react-table';
import { Navigate } from 'react-router-dom';
import AppShell from '@platform-ui/components/AppShell/AppShell';
import DataTable from '@platform-ui/components/DataTable/DataTable';
import Card from '@platform-ui/primitives/Card';
import Typography from '@platform-ui/primitives/Typography';
import Badge from '@platform-ui/primitives/Badge';
import ErrorState from '@platform-ui/feedback/ErrorState';
import { getOrders, type Order } from '@core/api/services/orderService';
import { useAuth } from '@core/auth/useAuth';
import { ROLE_CONFIG, isAppRole } from '../config/moduleRegistry';

const orderColumns: ColumnDef<Order>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'customer', header: 'Customer' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = String(getValue());
      const variant =
        status === 'completed'
          ? 'success'
          : status === 'pending'
            ? 'warning'
            : status === 'processing'
              ? 'primary'
              : 'danger';
      return <Badge variant={variant}>{status}</Badge>;
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
        <Typography variant="heading">Orders</Typography>
        {ordersQuery.isError && (
          <ErrorState
            title="Failed to load orders"
            message={(ordersQuery.error as { message?: string })?.message ?? 'Unknown error'}
          />
        )}
        <Card p="md">
          <DataTable
            columns={orderColumns}
            data={ordersQuery.data}
            isLoading={ordersQuery.isLoading}
          />
        </Card>
      </Stack>
    </AppShell>
  );
}
