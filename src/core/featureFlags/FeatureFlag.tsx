import type { ReactNode } from 'react';
import { useFeatureFlag, type FeatureFlagKey } from './useFeatureFlag';
import type { AppRole } from '@modules/platform/config/moduleRegistry';

interface FeatureFlagProps {
  flag: FeatureFlagKey;
  requiredRoles?: AppRole[];
  fallback?: ReactNode;
  children: ReactNode;
}

export default function FeatureFlag({
  flag,
  requiredRoles,
  fallback = null,
  children,
}: FeatureFlagProps) {
  const enabled = useFeatureFlag(flag, { requiredRoles });
  return enabled ? <>{children}</> : <>{fallback}</>;
}
