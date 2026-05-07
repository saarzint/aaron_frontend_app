import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';
import { useAuth } from '@core/auth/useAuth';
import { useTenantQueryKeys } from '@config/queryConfig';
import { ROLE_CONFIG, isAppRole } from '../config/moduleRegistry';
import { mockCustomers, type CustomerMock } from '@mocks/data';
import AppShell from '@platform-ui/components/AppShell/AppShell';
import DataTable from '@platform-ui/components/DataTable/DataTable';
import ErrorState from '@platform-ui/feedback/ErrorState';
import Badge from '@platform-ui/primitives/Badge';
import Card from '@platform-ui/primitives/Card';
import Typography from '@platform-ui/primitives/Typography';

const customerColumns: ColumnDef<CustomerMock>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Customer' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'company', header: 'Company' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = String(getValue());
      const variant =
        status === 'active' ? 'success' : status === 'pending' ? 'warning' : 'neutral';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
];

export default function CustomersPage() {
  const { role } = useAuth();
  const tenantQueryKeys = useTenantQueryKeys();
  const config = useMemo(() => (isAppRole(role) ? ROLE_CONFIG[role] : null), [role]);

  const customersQuery = useQuery({
    queryKey: tenantQueryKeys.custom(['customers']),
    queryFn: async () => mockCustomers,
  });

  if (!config) return <Navigate to="/login" replace />;

  return (
    <AppShell title={config.title} pageTitle="Customers" navigation={config.navigation}>
      <Card p="md">
        <Typography variant="heading">Customers</Typography>
        {customersQuery.isError && (
          <ErrorState
            title="Failed to load customers"
            message={(customersQuery.error as { message?: string })?.message ?? 'Unknown error'}
          />
        )}
        <DataTable
          columns={customerColumns}
          data={customersQuery.data}
          isLoading={customersQuery.isLoading}
        />
      </Card>
    </AppShell>
  );
}
