import type { TenantConfig } from './tenants';
import { useTenantContext } from '@core/tenant/TenantContext';

/**
 * Legacy interface for backward compatibility
 * New code should use useTenantContext() directly
 */
export interface TenantContextValue {
  tenantId: string;
  setTenantId: (id: string) => void;
  tenant: TenantConfig | null;
}

// Export the legacy context type (not used anymore, but kept for reference)
export const TenantContext = {
  Provider: null,
};

/**
 * Hook for backward compatibility
 * Provides: tenantId, setTenantId, tenant
 *
 * New code should use useTenantContext() from @core/tenant/TenantContext
 * which provides: tenantId, tenant, config, isLoading, error, switchTenant
 */
export function useTenant(): TenantContextValue {
  const { tenantId, tenant, switchTenant } = useTenantContext();

  return {
    tenantId,
    setTenantId: switchTenant,
    tenant: tenant || { id: tenantId, name: tenantId },
  };
}
