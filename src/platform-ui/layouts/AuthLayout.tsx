import { Center, Container, Paper, Stack, Title, Text } from '@mantine/core';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <Center mih="100vh" bg="gray.0">
      <Container size={420} w="100%">
        <Paper p="xl" radius="md" withBorder shadow="sm">
          <Stack gap="lg">
            <Stack gap={4}>
              <Title order={2}>{title}</Title>
              {subtitle && (
                <Text size="sm" c="dimmed">
                  {subtitle}
                </Text>
              )}
            </Stack>
            {children}
          </Stack>
        </Paper>
      </Container>
    </Center>
  );
}
