import type { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import QueryProvider from './QueryProvider';
import { AuthProvider } from '@core/auth/AuthProvider';
import { theme } from '@platform-ui/theme/theme';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" />
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </MantineProvider>
  );
}
