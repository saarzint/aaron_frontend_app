import { Group, Text } from '@mantine/core';
import { useMemo } from 'react';
import Button from '@platform-ui/primitives/Button';
import Avatar from '@platform-ui/primitives/Avatar';
import Select from '@platform-ui/primitives/Select';
import { useTenant } from '@platform-ui/theme/useTenant';
import { TENANTS } from '@platform-ui/theme/tenants';

interface AppTopbarProps {
  userLabel?: string;
  roleLabel?: string;
  onLogout: () => void;
}

export default function AppTopbar({ userLabel, roleLabel, onLogout }: AppTopbarProps) {
  const { tenantId, setTenantId, tenant } = useTenant();

  const tenantOptions = useMemo(
    () => Object.values(TENANTS).map((item) => ({ value: item.id, label: item.name })),
    []
  );

  return (
    <Group justify="space-between" h="100%" px="md">
      <Group gap="sm">
        <Avatar size="sm" color="brand">
          {(tenant ?? TENANTS.default).name.slice(0, 1)}
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
        <Select
          w={180}
          value={tenantId}
          onChange={(value) => value && setTenantId(value)}
          data={tenantOptions}
          size="xs"
          aria-label="Tenant switcher"
        />
        <Button variant="ghost" size="xs" onClick={onLogout}>
          Logout
        </Button>
      </Group>
    </Group>
  );
}
