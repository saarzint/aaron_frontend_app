import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { TenantConfig } from '@platform-ui/theme/tenants';
import { loadTenantConfig } from './tenantConfigService';
import { resolveTenant, switchTenant as storeSwitchTenant } from './tenantResolver';

export interface TenantContextValue {
  tenantId: string;
  tenant: TenantConfig | null;
  config: Record<string, unknown> | null;
  isLoading: boolean;
  error: Error | null;
  switchTenant: (tenantId: string) => Promise<void>;
}

const TenantContext = createContext<TenantContextValue | null>(null);

export interface TenantProviderProps {
  children: ReactNode;
  headerOverride?: string;
}

/**
 * TenantProvider
 *
 * Provides:
 * - Current tenant ID
 * - Resolved tenant config (branding, features, etc.)
 * - Loaded tenant-specific config (feature flags, settings)
 * - Loading and error states
 * - switchTenant() for changing tenant context
 *
 * Initialization:
 * - Resolves tenant from subdomain → header → storage → default
 * - Loads tenant config async
 * - Handles errors gracefully
 */
export function TenantProvider({ children, headerOverride }: TenantProviderProps) {
  const [tenantId, setTenantId] = useState<string>('default');
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isInitialized = useRef(false);

  // Initialize tenant on mount
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const { tenantId: resolved } = resolveTenant(headerOverride);
    setTenantId(resolved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load tenant config whenever tenantId changes
  useEffect(() => {
    if (!tenantId) return;

    let isMounted = true;

    (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const loaded = await loadTenantConfig(tenantId);
        if (isMounted) {
          setTenant(loaded.tenant);
          setConfig(loaded.config);
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error('Failed to load tenant config');
          setError(error);
          setTenant({ id: tenantId, name: tenantId });
          setConfig({});
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [tenantId]);

  const handleSwitchTenant = useCallback(
    async (newTenantId: string) => {
      if (newTenantId === tenantId) return;
      storeSwitchTenant(newTenantId);
      setTenantId(newTenantId);
    },
    [tenantId]
  );

  const value: TenantContextValue = {
    tenantId,
    tenant,
    config,
    isLoading,
    error,
    switchTenant: handleSwitchTenant,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

/**
 * Hook to access tenant context
 * Throws if not within TenantProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useTenantContext() {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error('useTenantContext must be used within TenantProvider');
  }
  return ctx;
}

export { TenantContext };
