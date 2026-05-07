import { useMemo, useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { createAppTheme } from './tokens';
import { TENANTS } from './tenants';
import { TenantContext, type TenantContextValue } from './useTenant';

export default function TenantThemeProvider({ children }: { children: React.ReactNode }) {
  const initial = localStorage.getItem('tenantId') ?? 'default';
  const [tenantId, setTenantId] = useState(initial);
  const queryClient = useQueryClient();

  const tenant = TENANTS[tenantId] ?? TENANTS.default;

  const mergedTheme = useMemo(
    () => createAppTheme({ brand: tenant.brand, fontFamily: tenant.fontFamily }),
    [tenant]
  );

  const setTenant = (id: string) => {
    if (id === tenantId) return;
    localStorage.setItem('tenantId', id);
    setTenantId(id);
    queryClient.clear();
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
