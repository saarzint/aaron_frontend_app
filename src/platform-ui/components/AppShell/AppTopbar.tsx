import { ActionIcon, Group, Loader, Menu, Stack, Text } from '@mantine/core';
import { IconLogout, IconUser, IconSettings } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import Avatar from '@platform-ui/primitives/Avatar';
import Select from '@platform-ui/primitives/Select';
import { useTenantContext } from '@core/tenant/TenantContext';
import { useTenantQueryClient } from '@config/queryConfig';
import { TENANTS } from '@platform-ui/theme/tenants';
import GlobalSearch from '../Navigation/GlobalSearch';
import NotificationsArea from '../Navigation/NotificationsArea';
import DynamicBreadcrumbs from '../Navigation/DynamicBreadcrumbs';

interface AppTopbarProps {
  userLabel?: string;
  roleLabel?: string;
  pageTitle?: string;
  onLogout: () => void;
  onSettings: () => void;
  showBreadcrumbs?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
}

export default function AppTopbar({
  userLabel,
  roleLabel,
  pageTitle,
  onLogout,
  onSettings,
  showBreadcrumbs = true,
  showSearch = true,
  showNotifications = true,
}: AppTopbarProps) {
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
      clearTenantCache();
      await switchTenant(value);
      await invalidateAllTenantQueries();
    } finally {
      setIsLoadingSwitch(false);
    }
  };

  const displayTenant = tenant || TENANTS.default;
  const isLoading = isTenantLoading || isLoadingSwitch;

  return (
    <Stack gap={0} style={{ flex: 1, height: '100%', justifyContent: 'space-between' }}>
      {/* Top Row: Tenant, Title, Search, Notifications, User Menu */}
      <Group justify="space-between" h={60} px="md" gap="md" wrap="nowrap">
        {/* Left: Tenant Avatar + Title Area */}
        <Group gap="sm" style={{ flex: 1, minWidth: 0 }}>
          <Avatar size="sm" color="brand">
            {displayTenant.name.slice(0, 1)}
          </Avatar>
          {pageTitle && (
            <Text size="md" fw={600} truncate>
              {pageTitle}
            </Text>
          )}
        </Group>

        {/* Center: Search */}
        {showSearch && <GlobalSearch onSearch={() => {}} />}

        {/* Right: Notifications, User Menu */}
        <Group gap="sm" wrap="nowrap">
          {showNotifications && <NotificationsArea />}

          {/* Tenant Switcher */}
          <Select
            w={140}
            value={tenantId}
            onChange={handleTenantChange}
            data={tenantOptions}
            size="xs"
            aria-label="Tenant switcher"
            disabled={isLoading}
            rightSection={isLoading ? <Loader size="xs" /> : undefined}
          />

          {/* User Menu */}
          <Menu position="bottom-end" withArrow>
            <Menu.Target>
              <ActionIcon variant="subtle" size="lg" disabled={isLoading}>
                <Avatar size="sm" color="brand">
                  {userLabel?.charAt(0).toUpperCase() ?? 'U'}
                </Avatar>
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item disabled leftSection={<IconUser size={14} />}>
                {userLabel ? (
                  <>
                    <div>
                      <Text size="sm" fw={600}>
                        {userLabel}
                      </Text>
                      {roleLabel && (
                        <Text size="xs" c="neutral.6">
                          {roleLabel}
                        </Text>
                      )}
                    </div>
                  </>
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
                disabled={isLoading}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      {/* Bottom Row: Breadcrumbs */}
      {showBreadcrumbs && (
        <Group h={40} px="md" wrap="nowrap">
          <DynamicBreadcrumbs />
        </Group>
      )}
    </Stack>
  );
}
