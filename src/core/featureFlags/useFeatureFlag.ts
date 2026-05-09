import { useTenantContext } from '@core/tenant/TenantContext';
import { useAuth } from '@core/auth/useAuth';
import type { AppRole } from '@modules/platform/config/moduleRegistry';

export type FeatureFlagKey =
  | 'advancedReporting'
  | 'customBranding'
  | 'sso'
  | 'exportData'
  | 'notificationsPanel'
  | 'experimentalWidgets';

interface FeatureFlagOptions {
  requiredRoles?: AppRole[];
}

export function useFeatureFlag(flag: FeatureFlagKey, options?: FeatureFlagOptions): boolean {
  const { config } = useTenantContext();
  const { role } = useAuth();

  const flags = config?.featureFlags as Record<string, boolean> | undefined;
  const isEnabled = flags?.[flag] ?? false;

  if (!isEnabled) return false;

  if (options?.requiredRoles && role) {
    return options.requiredRoles.includes(role as AppRole);
  }

  return true;
}
