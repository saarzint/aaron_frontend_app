import type { ReactNode } from 'react';
import { Notifications } from '@mantine/notifications';
import QueryProvider from './QueryProvider';
import { TenantProvider } from '@core/tenant/TenantContext';
import { AuthProvider } from '@core/auth/AuthProvider';
import TenantThemeProviderContent from '@platform-ui/theme/TenantThemeProvider';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <TenantProvider>
        <TenantThemeProviderContent>
          <Notifications position="top-right" />
          <AuthProvider>{children}</AuthProvider>
        </TenantThemeProviderContent>
      </TenantProvider>
    </QueryProvider>
  );
}
