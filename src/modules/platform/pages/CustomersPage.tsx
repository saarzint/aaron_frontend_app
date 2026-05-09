import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';
import { Stack } from '@mantine/core';
import { useAuth } from '@core/auth/useAuth';
import { useTenantQueryKeys } from '@config/queryConfig';
import { ROLE_CONFIG, isAppRole } from '../config/moduleRegistry';
import { mockCustomers, type CustomerMock } from '@mocks/data';
import AppShell from '@platform-ui/components/AppShell/AppShell';
import DataTable from '@platform-ui/components/DataTable/DataTable';
import ErrorState from '@platform-ui/feedback/ErrorState';
import Badge from '@platform-ui/primitives/Badge';
import Card from '@platform-ui/primitives/Card';

function useCustomerColumns(): ColumnDef<CustomerMock>[] {
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
  const tenantQueryKeys = useTenantQueryKeys();
  const config = useMemo(() => (isAppRole(role) ? ROLE_CONFIG[role] : null), [role]);
  const columns = useCustomerColumns();

  const customersQuery = useQuery({
    queryKey: tenantQueryKeys.custom(['customers']),
    queryFn: async () => mockCustomers,
  });

  if (!config) return <Navigate to="/login" replace />;

  return (
    <AppShell title={config.title} pageTitle={tNav('customers')} navigation={config.navigation}>
      <Stack gap="md">
        {customersQuery.isError && (
          <ErrorState
            title={t('errors.loadFailed')}
            message={(customersQuery.error as { message?: string })?.message ?? 'Unknown error'}
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
            columns={columns}
            data={customersQuery.data}
            isLoading={customersQuery.isLoading}
          />
        </Card>
      </Stack>
    </AppShell>
  );
}
