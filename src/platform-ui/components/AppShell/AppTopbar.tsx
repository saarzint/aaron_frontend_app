import { Group, Text, Loader } from '@mantine/core';
import { useMemo, useState } from 'react';
import Button from '@platform-ui/primitives/Button';
import Avatar from '@platform-ui/primitives/Avatar';
import Select from '@platform-ui/primitives/Select';
import { useTenantContext } from '@core/tenant/TenantContext';
import { useTenantQueryClient } from '@config/queryConfig';
import { TENANTS } from '@platform-ui/theme/tenants';

interface AppTopbarProps {
  userLabel?: string;
  roleLabel?: string;
  onLogout: () => void;
}

export default function AppTopbar({ userLabel, roleLabel, onLogout }: AppTopbarProps) {
  const { tenantId, tenant, isLoading: isTenantLoading, switchTenant } = useTenantContext();
  const { invalidateAllTenantQueries, clearTenantCache } = useTenantQueryClient();
  const [isLoadingSwitch, setIsLoadingSwitch] = useState(false);

  const tenantOptions = useMemo(
    () => Object.values(TENANTS).map((item) => ({ value: item.id, label: item.name })),
    []
  );

  const handleTenantChange = async (value: string | null) => {
    if (!value || value === tenantId) return;

    setIsLoadingSwitch(true);
    try {
      // Clear current tenant's cache before switching
      clearTenantCache();

      // Switch to new tenant
      await switchTenant(value);

      // Invalidate all queries for new tenant (will trigger refetch on next mount)
      await invalidateAllTenantQueries();
    } finally {
      setIsLoadingSwitch(false);
    }
  };

  const displayTenant = tenant || TENANTS.default;
  const isLoading = isTenantLoading || isLoadingSwitch;

  return (
    <Group justify="space-between" h="100%" px="md">
      <Group gap="sm">
        <Avatar size="sm" color="brand">
          {displayTenant.name.slice(0, 1)}
        </Avatar>
        <div>
          <Text size="sm" fw={600}>
            {userLabel ?? 'Signed in'}
          </Text>
          {roleLabel && (
            <Text size="xs" c="neutral.6">
              {roleLabel}
            </Text>
          )}
        </div>
      </Group>
      <Group gap="sm">
        <div style={{ position: 'relative', width: 180 }}>
          <Select
            w={180}
            value={tenantId}
            onChange={handleTenantChange}
            data={tenantOptions}
            size="xs"
            aria-label="Tenant switcher"
            disabled={isLoading}
            rightSection={isLoading ? <Loader size="xs" /> : undefined}
          />
        </div>
        <Button variant="ghost" size="xs" onClick={onLogout} disabled={isLoading}>
          Logout
        </Button>
      </Group>
    </Group>
  );
}
