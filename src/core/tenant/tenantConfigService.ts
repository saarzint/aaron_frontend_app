import type { TenantConfig } from '@platform-ui/theme/tenants';
import { TENANTS } from '@platform-ui/theme/tenants';

export interface LoadedTenantConfig {
  tenant: TenantConfig;
  config: {
    featureFlags?: Record<string, boolean>;
    localeDefaults?: {
      language: string;
      region: string;
    };
    navigationConfig?: unknown;
    apiEndpoints?: Record<string, string>;
    [key: string]: unknown;
  };
}

/**
 * Mock tenant configurations for development
 * In production, this would be loaded from an API
 */
const MOCK_TENANT_CONFIGS: Record<string, LoadedTenantConfig> = {
  default: {
    tenant: TENANTS.default,
    config: {
      featureFlags: {
        advancedReporting: false,
        customBranding: false,
        sso: false,
        exportData: false,
        notificationsPanel: true,
        experimentalWidgets: false,
      },
      localeDefaults: {
        language: 'en',
        region: 'US',
      },
      navigationConfig: {},
      apiEndpoints: {
        base: '/api',
      },
    },
  },
  acme: {
    tenant: TENANTS.acme,
    config: {
      featureFlags: {
        advancedReporting: true,
        customBranding: true,
        sso: true,
        exportData: true,
        notificationsPanel: true,
        experimentalWidgets: true,
      },
      localeDefaults: {
        language: 'en',
        region: 'US',
      },
      navigationConfig: {
        defaultRoute: '/dashboard/admin',
      },
      apiEndpoints: {
        base: '/api/acme',
      },
    },
  },
  northstar: {
    tenant: TENANTS.northstar,
    config: {
      featureFlags: {
        advancedReporting: true,
        customBranding: false,
        sso: true,
        exportData: true,
        notificationsPanel: false,
        experimentalWidgets: false,
      },
      localeDefaults: {
        language: 'en',
        region: 'EU',
      },
      navigationConfig: {
        defaultRoute: '/dashboard/org',
      },
      apiEndpoints: {
        base: '/api/northstar',
      },
    },
  },
};

/**
 * Load tenant configuration
 *
 * Priority:
 * 1. Mock configs (for development)
 * 2. Backend API (for production - not yet implemented)
 * 3. Fallback to default config
 *
 * Can be extended to:
 * - Load from backend API
 * - Cache results
 * - Validate config schema
 */
export async function loadTenantConfig(tenantId: string): Promise<LoadedTenantConfig> {
  // Simulate async loading
  await new Promise((resolve) => setTimeout(resolve, 0));

  // Development: use mock config
  if (MOCK_TENANT_CONFIGS[tenantId]) {
    return MOCK_TENANT_CONFIGS[tenantId];
  }

  // Fallback: return default config
  return MOCK_TENANT_CONFIGS.default;

  // Future production implementation:
  // const response = await fetch(`/api/tenants/${tenantId}/config`);
  // if (!response.ok) throw new Error(`Failed to load tenant config: ${response.statusText}`);
  // return response.json();
}

/**
 * Get feature flag for current tenant
 * Note: Use within TenantContext for current tenant
 */
export function getFeatureFlag(config: LoadedTenantConfig['config'], flagName: string): boolean {
  return config.featureFlags?.[flagName] ?? false;
}

/**
 * Add or update a mock tenant configuration
 * Useful for testing or runtime configuration updates
 */
export function setMockTenantConfig(tenantId: string, config: LoadedTenantConfig): void {
  MOCK_TENANT_CONFIGS[tenantId] = config;
}

/**
 * Clear mock tenant configurations (for testing)
 */
export function clearMockTenantConfigs(): void {
  Object.keys(MOCK_TENANT_CONFIGS).forEach((key) => {
    if (key !== 'default') {
      delete MOCK_TENANT_CONFIGS[key];
    }
  });
}
