import { createContext, useContext } from 'react';
import type { TenantConfig } from './tenants';

export interface TenantContextValue {
  tenantId: string;
  setTenantId: (id: string) => void;
  tenant: TenantConfig;
}

export const TenantContext = createContext<TenantContextValue | null>(null);

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantThemeProvider');
  return ctx;
}
