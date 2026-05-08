import { useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useTenantContext } from '@core/tenant/TenantContext';

/**
 * Tenant-aware Query Key Factory
 *
 * Creates scoped query keys that automatically include tenant context.
 * This ensures cache isolation between tenants.
 *
 * Examples:
 * - tenantQueryKey(['orders']) → ['tenant:acme', 'orders']
 * - tenantQueryKey(['user', userId]) → ['tenant:acme', 'user', userId]
 */
export function createTenantQueryKeyFactory(tenantId: string) {
  return {
    all: [{ tenant: tenantId }],
    orders: () => [{ tenant: tenantId }, 'orders'],
    order: (id: string) => [{ tenant: tenantId }, 'orders', id],
    users: () => [{ tenant: tenantId }, 'users'],
    user: (id: string) => [{ tenant: tenantId }, 'users', id],
    // Extend with more query patterns as needed
    custom: (scope: string[], params?: Record<string, unknown>) => [
      { tenant: tenantId },
      ...scope,
      ...(params ? [params] : []),
    ],
  };
}

/**
 * Hook to get tenant-scoped query client
 * Provides utilities for cache management per tenant
 */
export function useTenantQueryClient() {
  const queryClient = useQueryClient();
  const { tenantId } = useTenantContext();

  return {
    queryClient,
    tenantId,

    /**
     * Invalidate all queries for current tenant
     */
    invalidateAllTenantQueries: async () => {
      await queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey;
          return Array.isArray(key) && key[0] && typeof key[0] === 'object' && 'tenant' in key[0];
        },
      });
    },

    /**
     * Invalidate queries matching a scope for current tenant
     * Example: invalidateTenantQueries(['orders']) invalidates all order queries
     */
    invalidateTenantQueries: async (scope: string[]) => {
      await queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey;
          if (
            !Array.isArray(key) ||
            !key[0] ||
            typeof key[0] !== 'object' ||
            !('tenant' in key[0])
          ) {
            return false;
          }
          const firstKey = key[0] as { tenant: string };
          if (firstKey.tenant !== tenantId) return false;

          // Check if remaining key matches scope
          const remaining = key.slice(1);
          if (remaining.length < scope.length) return false;

          for (let i = 0; i < scope.length; i++) {
            if (remaining[i] !== scope[i]) return false;
          }
          return true;
        },
      });
    },

    /**
     * Prefetch a query for current tenant
     */
    prefetchTenantQuery: async <T>(
      queryKey: unknown[],
      queryFn: () => Promise<T>,
      options?: Partial<UseQueryOptions<T>>
    ) => {
      const scopedKey = [{ tenant: tenantId }, ...queryKey];
      await queryClient.prefetchQuery({
        queryKey: scopedKey,
        queryFn,
        ...options,
      });
    },

    /**
     * Get cached data for a tenant query
     */
    getTenantQueryData: <T>(queryKey: unknown[]): T | undefined => {
      const scopedKey = [{ tenant: tenantId }, ...queryKey];
      return queryClient.getQueryData<T>(scopedKey);
    },

    /**
     * Set cached data for a tenant query
     */
    setTenantQueryData: <T>(queryKey: unknown[], data: T): void => {
      const scopedKey = [{ tenant: tenantId }, ...queryKey];
      queryClient.setQueryData<T>(scopedKey, data);
    },

    /**
     * Clear all tenant queries without affecting other tenants
     */
    clearTenantCache: () => {
      queryClient.removeQueries({
        predicate: (query) => {
          const key = query.queryKey;
          return (
            Array.isArray(key) &&
            key[0] &&
            typeof key[0] === 'object' &&
            'tenant' in key[0] &&
            (key[0] as { tenant: string }).tenant === tenantId
          );
        },
      });
    },
  };
}

/**
 * Hook that returns a tenant-scoped query key factory
 * Useful for queries that need tenant context
 */
export function useTenantQueryKeys() {
  const { tenantId } = useTenantContext();
  return createTenantQueryKeyFactory(tenantId);
}

/**
 * Create a tenant-scoped query key
 * Use in useQuery/useMutation when combined with useTenantQueryClient
 *
 * Example:
 * const queryKey = createScopedQueryKey(['orders']);
 * // Results in: [{ tenant: 'acme' }, 'orders']
 */
export function createScopedQueryKey(tenantId: string, ...params: unknown[]): unknown[] {
  return [{ tenant: tenantId }, ...params];
}

/**
 * Hook for creating mutation options with automatic tenant invalidation
 * Useful for mutations that should invalidate related queries
 */
export function useTenantMutationOptions<T, TVariables>(queriesToInvalidate: string[][]) {
  const { tenantId } = useTenantContext();
  const queryClient = useQueryClient();

  return {
    onSuccess: async () => {
      // Invalidate all specified queries for this tenant
      for (const scope of queriesToInvalidate) {
        await queryClient.invalidateQueries({
          predicate: (query) => {
            const key = query.queryKey;
            if (
              !Array.isArray(key) ||
              !key[0] ||
              typeof key[0] !== 'object' ||
              !('tenant' in key[0])
            ) {
              return false;
            }
            const firstKey = key[0] as { tenant: string };
            if (firstKey.tenant !== tenantId) return false;

            const remaining = key.slice(1);
            for (let i = 0; i < scope.length; i++) {
              if (remaining[i] !== scope[i]) return false;
            }
            return true;
          },
        });
      }
    },
  } as UseMutationOptions<T, Error, TVariables>;
}
