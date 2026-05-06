import { useMemo, useState, createContext, useContext } from 'react';
import { MantineProvider } from '@mantine/core';
import { createAppTheme } from './tokens';
import { TENANTS, type TenantConfig } from './tenants';

interface TenantContextValue {
  tenantId: string;
  setTenantId: (id: string) => void;
  tenant: TenantConfig;
}

const TenantContext = createContext<TenantContextValue | null>(null);

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantThemeProvider');
  return ctx;
}

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

  return (
    <TenantContext.Provider value={{ tenantId, setTenantId: setTenant, tenant }}>
      <MantineProvider theme={mergedTheme} defaultColorScheme="light">
        {children}
      </MantineProvider>
    </TenantContext.Provider>
  );
}
