import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Group, Stack, Switch, Text } from '@mantine/core';
import { useAuth } from '@core/auth/useAuth';
import { ROLE_CONFIG, isAppRole } from '../config/moduleRegistry';
import { mockSettingRows } from '@mocks/data';
import AppShell from '@platform-ui/components/AppShell/AppShell';
import Card from '@platform-ui/primitives/Card';

export default function SettingsPage() {
  const { role } = useAuth();
  const config = useMemo(() => (isAppRole(role) ? ROLE_CONFIG[role] : null), [role]);

  if (!config) return <Navigate to="/login" replace />;

  return (
    <AppShell title={config.title} pageTitle="Settings" navigation={config.navigation}>
      <Stack gap="md">
        <Card
          p="lg"
          style={{
            border: '1px solid var(--mantine-color-default-border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <Stack gap="lg">
            {mockSettingRows.map((row) => (
              <Group key={row.title} justify="space-between" align="flex-start">
                <div>
                  <Text size="sm" fw={600}>
                    {row.title}
                  </Text>
                  <Text size="xs" c="dimmed" mt={2}>
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
