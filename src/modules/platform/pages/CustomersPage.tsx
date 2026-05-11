import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { Stack } from '@mantine/core';
import { type ColumnDef } from '@tanstack/react-table';
import { IconDownload } from '@tabler/icons-react';
import AppShell from '@platform-ui/components/AppShell/AppShell';
import Card from '@platform-ui/primitives/Card';
import Badge from '@platform-ui/primitives/Badge';
import { ServerTable, useServerTable, type BulkAction } from '@platform-ui/table';
import { getCustomersTable, type CustomerMock } from '@core/api/services/customerService';
import { useAuth } from '@core/auth/useAuth';
import { ROLE_CONFIG, isAppRole } from '../config/moduleRegistry';

function useCustomerColumns(): ColumnDef<CustomerMock, unknown>[] {
  const { t } = useTranslation('customers');

  return useMemo(
    () => [
      { accessorKey: 'id', header: t('columns.id') },
      { accessorKey: 'name', header: t('columns.name') },
      { accessorKey: 'email', header: t('columns.email') },
      { accessorKey: 'company', header: t('columns.company') },
      {
        accessorKey: 'status',
        header: t('columns.status'),
        cell: ({ getValue }) => {
          const status = String(getValue());
          const variant =
            status === 'active' ? 'success' : status === 'pending' ? 'warning' : 'neutral';
          return <Badge variant={variant}>{status}</Badge>;
        },
      },
    ],
    [t]
  );
}

const bulkActions: BulkAction<CustomerMock>[] = [
  {
    label: 'Export selected',
    icon: <IconDownload size={14} />,
    onClick: (rows) => {
      console.warn(
        'Export customers:',
        rows.map((r) => r.id)
      );
    },
  },
];

export default function CustomersPage() {
  const { role } = useAuth();
  const { t: tNav } = useTranslation('navigation');
  const config = useMemo(() => (isAppRole(role) ? ROLE_CONFIG[role] : null), [role]);
  const columns = useCustomerColumns();

  const tableInstance = useServerTable<CustomerMock>({
    queryKey: ['customers'],
    queryFn: getCustomersTable,
    columns,
    defaultPageSize: 10,
    savedViewKey: 'customers',
    filename: 'customers-export.csv',
  });

  if (!config) return <Navigate to="/login" replace />;

  return (
    <AppShell title={config.title} pageTitle={tNav('customers')} navigation={config.navigation}>
      <Stack gap="md">
        <Card p="lg">
          <ServerTable
            instance={tableInstance}
            bulkActions={bulkActions}
            emptyMessage="No customers found. Try adjusting your search or filters."
          />
        </Card>
      </Stack>
    </AppShell>
  );
}
