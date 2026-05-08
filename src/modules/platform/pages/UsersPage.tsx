import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';
import { Stack } from '@mantine/core';
import { useAuth } from '@core/auth/useAuth';
import { useTenantQueryKeys } from '@config/queryConfig';
import { ROLE_CONFIG, isAppRole } from '../config/moduleRegistry';
import { mockUsers, type UserMock } from '@mocks/data';
import AppShell from '@platform-ui/components/AppShell/AppShell';
import DataTable from '@platform-ui/components/DataTable/DataTable';
import ErrorState from '@platform-ui/feedback/ErrorState';
import Badge from '@platform-ui/primitives/Badge';
import Card from '@platform-ui/primitives/Card';

function useUserColumns(): ColumnDef<UserMock>[] {
  const { t } = useTranslation('users');

  return useMemo(
    () => [
      { accessorKey: 'id', header: t('columns.id') },
      { accessorKey: 'name', header: t('columns.name') },
      { accessorKey: 'email', header: t('columns.email') },
      { accessorKey: 'role', header: t('columns.role') },
      {
        accessorKey: 'status',
        header: t('columns.status'),
        cell: ({ getValue }) => {
          const status = String(getValue());
          const variant =
            status === 'active' ? 'success' : status === 'invited' ? 'warning' : 'danger';
          return <Badge variant={variant}>{status}</Badge>;
        },
      },
      { accessorKey: 'lastActive', header: t('columns.lastActive') },
    ],
    [t]
  );
}

export default function UsersPage() {
  const { role } = useAuth();
  const { t } = useTranslation('users');
  const { t: tNav } = useTranslation('navigation');
  const tenantQueryKeys = useTenantQueryKeys();
  const config = useMemo(() => (isAppRole(role) ? ROLE_CONFIG[role] : null), [role]);
  const columns = useUserColumns();

  const usersQuery = useQuery({
    queryKey: tenantQueryKeys.custom(['users']),
    queryFn: async () => mockUsers,
  });

  if (!config) return <Navigate to="/login" replace />;

  return (
    <AppShell title={config.title} pageTitle={tNav('users')} navigation={config.navigation}>
      <Stack gap="md">
        {usersQuery.isError && (
          <ErrorState
            title={t('errors.loadFailed')}
            message={(usersQuery.error as { message?: string })?.message ?? 'Unknown error'}
          />
        )}
        <Card
          p="lg"
          style={{
            border: '1px solid var(--mantine-color-default-border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <DataTable columns={columns} data={usersQuery.data} isLoading={usersQuery.isLoading} />
        </Card>
      </Stack>
    </AppShell>
  );
}
