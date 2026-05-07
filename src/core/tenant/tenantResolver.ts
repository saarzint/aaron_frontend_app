/**
 * Centralized tenant resolution supporting:
 * - Subdomain-based tenant detection (acme.app.localhost → acme)
 * - Header-based tenant override (x-tenant-id header)
 * - Local storage fallback (development)
 * - Default tenant fallback
 */

const TENANT_STORAGE_KEY = 'tenantId';
const APP_DOMAIN_SUFFIX = 'app.localhost';
const PROD_DOMAIN_SUFFIX = 'app.example.com'; // For future production

export interface TenantResolution {
  tenantId: string;
  source: 'subdomain' | 'header' | 'storage' | 'default';
}

/**
 * Resolve tenant from subdomain
 * Examples:
 * - acme.app.localhost → acme
 * - northstar.app.localhost → northstar
 * - app.localhost → null (no subdomain)
 * - localhost → null
 */
function resolveTenantFromSubdomain(): string | null {
  if (typeof window === 'undefined') return null;

  const hostname = window.location.hostname;

  // Check for development pattern: tenant.app.localhost
  if (hostname.endsWith(`.${APP_DOMAIN_SUFFIX}`)) {
    const subdomain = hostname.split('.')[0];
    return subdomain && subdomain !== 'app' ? subdomain : null;
  }

  // Future production pattern: tenant.app.example.com
  if (hostname.endsWith(`.${PROD_DOMAIN_SUFFIX}`)) {
    const subdomain = hostname.split('.')[0];
    return subdomain && subdomain !== 'app' ? subdomain : null;
  }

  return null;
}

/**
 * Resolve tenant from request header (for SSR or API override scenarios)
 */
function resolveTenantFromHeader(headerValue?: string): string | null {
  return headerValue ? headerValue.trim() : null;
}

/**
 * Get persisted tenant from localStorage
 */
function getTenantFromStorage(): string | null {
  if (typeof localStorage === 'undefined') return null;
  const stored = localStorage.getItem(TENANT_STORAGE_KEY);
  return stored ? stored.trim() : null;
}

/**
 * Persist tenant to localStorage
 */
function persistTenant(tenantId: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(TENANT_STORAGE_KEY, tenantId);
  }
}

/**
 * Clear tenant from localStorage
 */
function clearTenantStorage(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(TENANT_STORAGE_KEY);
  }
}

/**
 * Resolve tenant following this priority:
 * 1. Header override (if provided)
 * 2. Subdomain detection
 * 3. localStorage
 * 4. 'default' as final fallback
 */
export function resolveTenant(headerOverride?: string): TenantResolution {
  // Priority 1: Header override
  if (headerOverride) {
    const tenant = resolveTenantFromHeader(headerOverride);
    if (tenant) return { tenantId: tenant, source: 'header' };
  }

  // Priority 2: Subdomain
  const subdomain = resolveTenantFromSubdomain();
  if (subdomain) {
    persistTenant(subdomain);
    return { tenantId: subdomain, source: 'subdomain' };
  }

  // Priority 3: Storage
  const stored = getTenantFromStorage();
  if (stored) return { tenantId: stored, source: 'storage' };

  // Priority 4: Default
  return { tenantId: 'default', source: 'default' };
}

/**
 * Get current tenant from any source (storage, subdomain, or default)
 */
export function getCurrentTenant(): string {
  const stored = getTenantFromStorage();
  if (stored) return stored;

  const subdomain = resolveTenantFromSubdomain();
  if (subdomain) return subdomain;

  return 'default';
}

/**
 * Change tenant and persist to storage
 */
export function switchTenant(tenantId: string): void {
  persistTenant(tenantId);
}

/**
 * Utilities for tests/special scenarios
 */
export const tenantResolverUtils = {
  getTenantFromStorage,
  persistTenant,
  clearTenantStorage,
  resolveTenantFromSubdomain,
  resolveTenantFromHeader,
  TENANT_STORAGE_KEY,
};
