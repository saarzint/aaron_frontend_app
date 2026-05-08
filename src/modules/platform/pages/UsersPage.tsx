import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';
import { useAuth } from '@core/auth/useAuth';
import { useTenantQueryKeys } from '@config/queryConfig';
import { ROLE_CONFIG, isAppRole } from '../config/moduleRegistry';
import { mockUsers, type UserMock } from '@mocks/data';
import AppShell from '@platform-ui/components/AppShell/AppShell';
import DataTable from '@platform-ui/components/DataTable/DataTable';
import ErrorState from '@platform-ui/feedback/ErrorState';
import Badge from '@platform-ui/primitives/Badge';
import Card from '@platform-ui/primitives/Card';
import Typography from '@platform-ui/primitives/Typography';

const userColumns: ColumnDef<UserMock>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = String(getValue());
      const variant = status === 'active' ? 'success' : status === 'invited' ? 'warning' : 'danger';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  { accessorKey: 'lastActive', header: 'Last Active' },
];

export default function UsersPage() {
  const { role } = useAuth();
  const tenantQueryKeys = useTenantQueryKeys();
  const config = useMemo(() => (isAppRole(role) ? ROLE_CONFIG[role] : null), [role]);

  const usersQuery = useQuery({
    queryKey: tenantQueryKeys.custom(['users']),
    queryFn: async () => mockUsers,
  });

  if (!config) return <Navigate to="/login" replace />;

  return (
    <AppShell title={config.title} pageTitle="Users" navigation={config.navigation}>
      <Card p="md">
        <Typography variant="heading">Users</Typography>
        {usersQuery.isError && (
          <ErrorState
            title="Failed to load users"
            message={(usersQuery.error as { message?: string })?.message ?? 'Unknown error'}
          />
        )}
        <DataTable columns={userColumns} data={usersQuery.data} isLoading={usersQuery.isLoading} />
      </Card>
    </AppShell>
  );
}
