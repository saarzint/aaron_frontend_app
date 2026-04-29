import { Button, Group, Text } from '@mantine/core';

interface AppTopbarProps {
  userLabel?: string;
  roleLabel?: string;
  onLogout: () => void;
}

export default function AppTopbar({ userLabel, roleLabel, onLogout }: AppTopbarProps) {
  return (
    <Group justify="space-between" h="100%" px="md">
      <Group gap="xs">
        {userLabel && <Text size="sm">{userLabel}</Text>}
        {roleLabel && (
          <Text size="xs" c="dimmed">
            ({roleLabel})
          </Text>
        )}
      </Group>
      <Button variant="subtle" size="xs" onClick={onLogout}>
        Logout
      </Button>
    </Group>
  );
}
