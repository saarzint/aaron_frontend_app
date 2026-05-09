import { Button, Center, Stack, Text, Title } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

interface ErrorFallbackProps {
  error: Error;
  onReset: () => void;
}

export default function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <Center style={{ minHeight: '100vh', padding: 24 }}>
      <Stack align="center" gap="lg" maw={480} style={{ textAlign: 'center' }}>
        <Center
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: 'var(--mantine-color-red-0)',
            color: 'var(--mantine-color-red-6)',
          }}
        >
          <IconAlertTriangle size={32} stroke={1.5} />
        </Center>

        <Stack gap={8} align="center">
          <Title order={3} fw={700}>
            Something went wrong
          </Title>
          <Text size="sm" c="dimmed" style={{ maxWidth: 360 }}>
            An unexpected error occurred. Our team has been notified. Please try again or reload the
            page.
          </Text>
        </Stack>

        {import.meta.env.DEV && error.message && (
          <Text
            size="xs"
            c="dimmed"
            style={{
              fontFamily: 'monospace',
              backgroundColor: 'var(--mantine-color-gray-0)',
              padding: '8px 12px',
              borderRadius: 6,
              maxWidth: '100%',
              wordBreak: 'break-all',
              textAlign: 'left',
            }}
          >
            {error.message}
          </Text>
        )}

        <Stack gap="sm" style={{ width: '100%' }}>
          <Button onClick={onReset} variant="filled">
            Try again
          </Button>
          <Button onClick={() => window.location.reload()} variant="subtle" color="gray">
            Reload page
          </Button>
        </Stack>
      </Stack>
    </Center>
  );
}
