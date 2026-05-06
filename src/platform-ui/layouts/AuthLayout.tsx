import { Center, Container, Stack } from '@mantine/core';
import type { ReactNode } from 'react';
import Card from '@platform-ui/primitives/Card';
import Typography from '@platform-ui/primitives/Typography';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <Center mih="100vh" bg="neutral.0">
      <Container size={420} w="100%">
        <Card p="xl">
          <Stack gap="lg">
            <Stack gap={4}>
              <Typography variant="heading">{title}</Typography>
              {subtitle && <Typography variant="caption">{subtitle}</Typography>}
            </Stack>
            {children}
          </Stack>
        </Card>
      </Container>
    </Center>
  );
}
