import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Stack } from '@mantine/core';
import { type ColumnDef } from '@tanstack/react-table';
import { Navigate } from 'react-router-dom';
import AppShell from '@platform-ui/components/AppShell/AppShell';
import DataTable from '@platform-ui/components/DataTable/DataTable';
import Card from '@platform-ui/primitives/Card';
import Badge from '@platform-ui/primitives/Badge';
import ErrorState from '@platform-ui/feedback/ErrorState';
import { getOrders, type Order } from '@core/api/services/orderService';
import { useAuth } from '@core/auth/useAuth';
import { useTenantQueryKeys } from '@config/queryConfig';
import { ROLE_CONFIG, isAppRole } from '../config/moduleRegistry';

const orderColumns: ColumnDef<Order>[] = [
  { accessorKey: 'id', header: 'Order ID' },
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
  { accessorKey: 'createdAt', header: 'Date' },
];

export default function OrdersPage() {
  const { role } = useAuth();
  const tenantQueryKeys = useTenantQueryKeys();
  const config = useMemo(() => (isAppRole(role) ? ROLE_CONFIG[role] : null), [role]);

  const ordersQuery = useQuery({
    queryKey: tenantQueryKeys.orders(),
    queryFn: getOrders,
  });

  if (!config) return <Navigate to="/login" replace />;

  return (
    <AppShell title={config.title} pageTitle="Orders" navigation={config.navigation}>
      <Stack gap="md">
        {ordersQuery.isError && (
          <ErrorState
            title="Failed to load orders"
            message={(ordersQuery.error as { message?: string })?.message ?? 'Unknown error'}
          />
        )}
        <Card
          p="lg"
          style={{
            border: '1px solid var(--mantine-color-default-border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
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
