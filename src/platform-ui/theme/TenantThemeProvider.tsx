import { useMemo } from 'react';
import { MantineProvider } from '@mantine/core';
import { createAppTheme } from './tokens';
import { useTenantContext } from '@core/tenant/TenantContext';

/**
 * TenantThemeProvider
 *
 * Wraps Mantine provider and applies theme based on current tenant.
 * Tenant state is managed by TenantProvider (in core/tenant/TenantContext).
 *
 * Note: This component should be placed AFTER TenantProvider in the component tree.
 */
function TenantThemeProviderContent({ children }: { children: React.ReactNode }) {
  const { tenant } = useTenantContext();

  const mergedTheme = useMemo(
    () =>
      createAppTheme({
        brand: tenant?.brand,
        fontFamily: tenant?.fontFamily,
      }),
    [tenant]
  );

  return (
    <MantineProvider theme={mergedTheme} defaultColorScheme="light">
      {children}
    </MantineProvider>
  );
}

export default TenantThemeProviderContent;
