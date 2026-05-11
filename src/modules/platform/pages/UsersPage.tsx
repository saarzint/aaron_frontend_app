import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { Stack } from '@mantine/core';
import { type ColumnDef } from '@tanstack/react-table';
import { IconUserOff } from '@tabler/icons-react';
import AppShell from '@platform-ui/components/AppShell/AppShell';
import Card from '@platform-ui/primitives/Card';
import Badge from '@platform-ui/primitives/Badge';
import { ServerTable, useServerTable, type BulkAction } from '@platform-ui/table';
import { getUsersTable, type UserMock } from '@core/api/services/userService';
import { useAuth } from '@core/auth/useAuth';
import { ROLE_CONFIG, isAppRole } from '../config/moduleRegistry';

function useUserColumns(): ColumnDef<UserMock, unknown>[] {
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

const bulkActions: BulkAction<UserMock>[] = [
  {
    label: 'Suspend selected',
    variant: 'danger',
    icon: <IconUserOff size={14} />,
    onClick: (rows) => {
      // Placeholder: wire to real suspend mutation
      console.warn(
        'Suspend users:',
        rows.map((r) => r.id)
      );
    },
  },
];

export default function UsersPage() {
  const { role } = useAuth();
  const { t: tNav } = useTranslation('navigation');
  const config = useMemo(() => (isAppRole(role) ? ROLE_CONFIG[role] : null), [role]);
  const columns = useUserColumns();

  const tableInstance = useServerTable<UserMock>({
    queryKey: ['users'],
    queryFn: getUsersTable,
    columns,
    defaultPageSize: 10,
    savedViewKey: 'users',
    filename: 'users-export.csv',
  });

  if (!config) return <Navigate to="/login" replace />;

  return (
    <AppShell title={config.title} pageTitle={tNav('users')} navigation={config.navigation}>
      <Stack gap="md">
        <Card p="lg">
          <ServerTable
            instance={tableInstance}
            bulkActions={bulkActions}
            emptyMessage="No users found. Try adjusting your search or filters."
          />
        </Card>
      </Stack>
    </AppShell>
  );
}
