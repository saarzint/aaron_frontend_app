import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { Group, Stack } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import apiClient from '@core/api/apiClient';
import { useTenantQueryClient } from '@config/queryConfig';
import AppShell from '@platform-ui/components/AppShell/AppShell';
import Card from '@platform-ui/primitives/Card';
import Badge from '@platform-ui/primitives/Badge';
import Button from '@platform-ui/primitives/Button';
import { ServerTable, useServerTable, type BulkAction } from '@platform-ui/table';
import { getCustomersTable, type CustomerMock } from '@core/api/services/customerService';
import { useAuth } from '@core/auth/useAuth';
import { ROLE_CONFIG, isAppRole } from '../config/moduleRegistry';
import CustomerFormModal from '../components/CustomerFormModal';

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

export default function CustomersPage() {
  const { role } = useAuth();
  const { t } = useTranslation('customers');
  const { t: tNav } = useTranslation('navigation');
  const queryClient = useQueryClient();
  const { invalidateTenantQueries } = useTenantQueryClient();
  const config = useMemo(() => (isAppRole(role) ? ROLE_CONFIG[role] : null), [role]);
  const columns = useCustomerColumns();
  const [modalOpen, setModalOpen] = useState(false);

  const bulkActions: BulkAction<CustomerMock>[] = [
    {
      label: 'Delete selected',
      variant: 'danger',
      icon: <IconTrash size={14} />,
      onClick: async (rows) => {
        await Promise.all(rows.map((row) => apiClient.delete(`/customers/${row.id}`)));
        await queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) && query.queryKey.includes('customers'),
        });
        await invalidateTenantQueries(['customers']);
      },
    },
  ];

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
        <Group justify="flex-end">
          <Button onClick={() => setModalOpen(true)} variant="primary">
            <IconPlus size={16} style={{ marginRight: 6 }} />
            {t('form.addButton')}
          </Button>
        </Group>
        <Card p="lg">
          <ServerTable
            instance={tableInstance}
            bulkActions={bulkActions}
            emptyMessage="No customers found. Try adjusting your search or filters."
          />
        </Card>
      </Stack>
      <CustomerFormModal opened={modalOpen} onClose={() => setModalOpen(false)} />
    </AppShell>
  );
}
