import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Group, Stack, Switch, Text } from '@mantine/core';
import { useAuth } from '@core/auth/useAuth';
import { ROLE_CONFIG, isAppRole } from '../config/moduleRegistry';
import AppShell from '@platform-ui/components/AppShell/AppShell';
import Card from '@platform-ui/primitives/Card';
import Typography from '@platform-ui/primitives/Typography';

const settingsRows = [
  {
    title: 'Email notifications',
    description: 'Receive alerts for orders, users, and account activity.',
    enabled: true,
  },
  {
    title: 'Compact navigation',
    description: 'Keep the sidebar collapsed by default on large screens.',
    enabled: false,
  },
  {
    title: 'Experimental features',
    description: 'Allow early access to tenant-specific beta features.',
    enabled: false,
  },
];

export default function SettingsPage() {
  const { role } = useAuth();
  const config = useMemo(() => (isAppRole(role) ? ROLE_CONFIG[role] : null), [role]);

  if (!config) return <Navigate to="/login" replace />;

  return (
    <AppShell title={config.title} pageTitle="Settings" navigation={config.navigation}>
      <Stack gap="md">
        <Typography variant="heading">Settings</Typography>
        <Card p="md">
          <Stack gap="md">
            {settingsRows.map((row) => (
              <Group key={row.title} justify="space-between" align="flex-start">
                <div>
                  <Text fw={600}>{row.title}</Text>
                  <Text size="sm" c="neutral.6">
                    {row.description}
                  </Text>
                </div>
                <Switch defaultChecked={row.enabled} aria-label={row.title} />
              </Group>
            ))}
          </Stack>
        </Card>
      </Stack>
    </AppShell>
  );
}
