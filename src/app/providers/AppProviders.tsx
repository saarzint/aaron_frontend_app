import type { ReactNode } from 'react';
import { Notifications } from '@mantine/notifications';
import QueryProvider from './QueryProvider';
import { AuthProvider } from '@core/auth/AuthProvider';
import TenantThemeProvider from '@platform-ui/theme/TenantThemeProvider';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <TenantThemeProvider>
      <Notifications position="top-right" />
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </TenantThemeProvider>
  );
}
