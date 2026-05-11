import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { Stack } from '@mantine/core';
import { type ColumnDef } from '@tanstack/react-table';
import { IconTrash } from '@tabler/icons-react';
import AppShell from '@platform-ui/components/AppShell/AppShell';
import Card from '@platform-ui/primitives/Card';
import Badge from '@platform-ui/primitives/Badge';
import { ServerTable, useServerTable, type BulkAction } from '@platform-ui/table';
import { getOrdersTable, type Order } from '@core/api/services/orderService';
import { useAuth } from '@core/auth/useAuth';
import { useFormatters } from '@core/formatting/useFormatters';
import { ROLE_CONFIG, isAppRole } from '../config/moduleRegistry';

function useOrderColumns(): ColumnDef<Order, unknown>[] {
  const { t } = useTranslation('orders');
  const fmt = useFormatters();

  return useMemo(
    () => [
      { accessorKey: 'id', header: t('columns.orderId') },
      { accessorKey: 'customer', header: t('columns.customer') },
      {
        accessorKey: 'status',
        header: t('columns.status'),
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
        header: t('columns.total'),
        cell: ({ getValue }) => fmt.currency(Number(getValue())),
      },
      { accessorKey: 'createdAt', header: t('columns.date') },
    ],
    [t, fmt]
  );
}

const bulkActions: BulkAction<Order>[] = [
  {
    label: 'Delete selected',
    variant: 'danger',
    icon: <IconTrash size={14} />,
    onClick: (rows) => {
      // Placeholder: wire to real delete mutation
      console.warn(
        'Delete orders:',
        rows.map((r) => r.id)
      );
    },
  },
];

export default function OrdersPage() {
  const { role } = useAuth();
  const { t: tNav } = useTranslation('navigation');
  const config = useMemo(() => (isAppRole(role) ? ROLE_CONFIG[role] : null), [role]);
  const columns = useOrderColumns();

  const tableInstance = useServerTable<Order>({
    queryKey: ['orders'],
    queryFn: getOrdersTable,
    columns,
    defaultPageSize: 10,
    savedViewKey: 'orders',
    filename: 'orders-export.csv',
  });

  if (!config) return <Navigate to="/login" replace />;

  return (
    <AppShell title={config.title} pageTitle={tNav('orders')} navigation={config.navigation}>
      <Stack gap="md">
        <Card p="lg">
          <ServerTable
            instance={tableInstance}
            bulkActions={bulkActions}
            emptyMessage="No orders found. Try adjusting your search or filters."
          />
        </Card>
      </Stack>
    </AppShell>
  );
}
