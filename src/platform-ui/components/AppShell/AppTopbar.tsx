import { ActionIcon, Box, Group, Loader, Menu, Text } from '@mantine/core';
import { IconLogout, IconUser, IconSettings } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import Avatar from '@platform-ui/primitives/Avatar';
import Select from '@platform-ui/primitives/Select';
import { useTenantContext } from '@core/tenant/TenantContext';
import { useTenantQueryClient } from '@config/queryConfig';
import { TENANTS } from '@platform-ui/theme/tenants';
import GlobalSearch from '../Navigation/GlobalSearch';
import NotificationsArea from '../Navigation/NotificationsArea';

interface AppTopbarProps {
  userLabel?: string;
  roleLabel?: string;
  pageTitle?: string;
  onLogout: () => void;
  onSettings: () => void;
  showSearch?: boolean;
  showNotifications?: boolean;
}

export default function AppTopbar({
  userLabel,
  roleLabel,
  pageTitle,
  onLogout,
  onSettings,
  showSearch = true,
  showNotifications = true,
}: AppTopbarProps) {
  const { tenantId, isLoading: isTenantLoading, switchTenant } = useTenantContext();
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
      clearTenantCache();
      await switchTenant(value);
      await invalidateAllTenantQueries();
    } finally {
      setIsLoadingSwitch(false);
    }
  };

  const isLoading = isTenantLoading || isLoadingSwitch;

  return (
    <Group justify="space-between" h="100%" style={{ flex: 1 }} wrap="nowrap" gap="md">
      {/* Left: Page title */}
      <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
        {pageTitle && (
          <Text size="md" fw={600} truncate>
            {pageTitle}
          </Text>
        )}
      </Group>

      {/* Right: Search, Notifications, Tenant, User */}
      <Group gap="sm" wrap="nowrap" style={{ flexShrink: 0 }}>
        {showSearch && (
          <Box visibleFrom="sm">
            <GlobalSearch onSearch={() => {}} />
          </Box>
        )}

        {showNotifications && <NotificationsArea />}

        <Select
          w={130}
          value={tenantId}
          onChange={handleTenantChange}
          data={tenantOptions}
          size="xs"
          aria-label="Tenant switcher"
          disabled={isLoading}
          rightSection={isLoading ? <Loader size="xs" /> : undefined}
        />

        <Menu position="bottom-end" withArrow>
          <Menu.Target>
            <ActionIcon variant="subtle" size="lg" disabled={isLoading} aria-label="User menu">
              <Avatar size="sm" color="brand">
                {userLabel?.charAt(0).toUpperCase() ?? 'U'}
              </Avatar>
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item disabled leftSection={<IconUser size={14} />}>
              {userLabel ? (
                <Box>
                  <Text size="sm" fw={600}>
                    {userLabel}
                  </Text>
                  {roleLabel && (
                    <Text size="xs" c="dimmed" tt="capitalize">
                      {roleLabel.replace(/_/g, ' ')}
                    </Text>
                  )}
                </Box>
              ) : (
                'Profile'
              )}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item leftSection={<IconSettings size={14} />} onClick={onSettings}>
              Settings
            </Menu.Item>
            <Menu.Item
              leftSection={<IconLogout size={14} />}
              onClick={onLogout}
              color="red"
              disabled={isLoading}
            >
              Log out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}
