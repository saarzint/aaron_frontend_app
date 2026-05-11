import { useState, useCallback } from 'react';
import type { SavedView, TableViewState } from './types';

const readFromStorage = (key: string): SavedView[] => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]') as SavedView[];
  } catch {
    return [];
  }
};

/**
 * Persists named table views in localStorage, scoped to tenant + user + table.
 * Key format: tableViews:{tenantId}:{userId}:{tableKey}
 * This ensures views are isolated per user and per tenant — no cross-user or
 * cross-tenant bleed even when sharing a browser session.
 *
 * The storage key is computed once on mount via the lazy useState initializer.
 * In practice, tenantId and userId only change on full remount (logout/tenant switch),
 * so a re-sync effect is not needed.
 */
export function useSavedViews(tenantId: string, userId: string, tableKey: string) {
  const lsKey = `tableViews:${tenantId}:${userId}:${tableKey}`;

  const [prevKey, setPrevKey] = useState(lsKey);
  const [views, setViews] = useState<SavedView[]>(() => readFromStorage(lsKey));

  // Derived-state resync: when the storage key changes (login/logout/tenant switch),
  // reload views from the new key. Calling setState during render is the React-docs
  // pattern for "storing information from previous renders" — avoids both useEffect
  // and useRef during render, both flagged by react-hooks v7.
  if (prevKey !== lsKey) {
    setPrevKey(lsKey);
    setViews(readFromStorage(lsKey));
  }

  const persist = useCallback(
    (next: SavedView[]) => {
      setViews(next);
      localStorage.setItem(lsKey, JSON.stringify(next));
    },
    [lsKey]
  );

  const save = useCallback(
    (name: string, state: TableViewState) => {
      const view: SavedView = {
        id: `view-${Date.now()}`,
        name,
        state,
        createdAt: Date.now(),
      };
      persist([...views, view]);
    },
    [views, persist]
  );

  const remove = useCallback(
    (id: string) => {
      persist(views.filter((v) => v.id !== id));
    },
    [views, persist]
  );

  return { views, save, remove };
}
