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

type StatusVariant = 'success' | 'warning' | 'primary' | 'danger' | 'neutral';

const ORDER_STATUS_VARIANT: Record<string, StatusVariant> = {
  completed: 'success',
  pending: 'warning',
  processing: 'primary',
  cancelled: 'danger',
};

function useOrderColumns(): ColumnDef<Order, unknown>[] {
  const { t } = useTranslation('orders');
  const { t: tCommon } = useTranslation('common');
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
          const variant = ORDER_STATUS_VARIANT[status] ?? 'neutral';
          const label = tCommon(`status.${status}`, status);
          return <Badge variant={variant}>{label}</Badge>;
        },
      },
      {
        accessorKey: 'total',
        header: t('columns.total'),
        cell: ({ getValue }) => fmt.currency(Number(getValue())),
      },
      { accessorKey: 'createdAt', header: t('columns.date') },
    ],
    [t, tCommon, fmt]
  );
}

export default function OrdersPage() {
  const { role } = useAuth();
  const { t: tNav } = useTranslation('navigation');
  const { t: tCommon } = useTranslation('common');
  const config = useMemo(() => (isAppRole(role) ? ROLE_CONFIG[role] : null), [role]);
  const columns = useOrderColumns();

  const bulkActions: BulkAction<Order>[] = useMemo(
    () => [
      {
        label: tCommon('actions.deleteSelected'),
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
    ],
    [tCommon]
  );

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
            emptyMessage={tCommon('emptyStates.noOrders')}
          />
        </Card>
      </Stack>
    </AppShell>
  );
}
