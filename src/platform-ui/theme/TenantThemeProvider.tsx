import { useMemo, useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { createAppTheme } from './tokens';
import { TENANTS } from './tenants';
import { TenantContext, type TenantContextValue } from './useTenant';

export default function TenantThemeProvider({ children }: { children: React.ReactNode }) {
  const initial = localStorage.getItem('tenantId') ?? 'default';
  const [tenantId, setTenantId] = useState(initial);

  const tenant = TENANTS[tenantId] ?? TENANTS.default;

  const mergedTheme = useMemo(
    () => createAppTheme({ brand: tenant.brand, fontFamily: tenant.fontFamily }),
    [tenant]
  );

  const setTenant = (id: string) => {
    localStorage.setItem('tenantId', id);
    setTenantId(id);
  };

  const value: TenantContextValue = { tenantId, setTenantId: setTenant, tenant };

  return (
    <TenantContext.Provider value={value}>
      <MantineProvider theme={mergedTheme} defaultColorScheme="light">
        {children}
      </MantineProvider>
    </TenantContext.Provider>
  );
}
