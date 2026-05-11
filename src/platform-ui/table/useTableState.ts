import { useState, useCallback } from 'react';
import type { SortingState, VisibilityState, RowSelectionState } from '@tanstack/react-table';
import type { TableParams } from './types';

interface UseTableStateOptions {
  defaultPageSize?: number;
}

export function useTableState({ defaultPageSize = 10 }: UseTableStateOptions = {}) {
  const [page, setPageState] = useState(1);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);
  const [sorting, setSortingState] = useState<SortingState>([]);
  const [search, setSearchState] = useState('');
  const [columnVisibility, setColumnVisibilityState] = useState<VisibilityState>({});
  const [rowSelection, setRowSelectionState] = useState<RowSelectionState>({});

  const setSearch = useCallback((value: string) => {
    setSearchState(value);
    setPageState(1);
  }, []);

  const setPage = useCallback((p: number) => setPageState(p), []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPageState(1);
  }, []);

  // These accept the Updater<T> pattern from TanStack Table (T | ((prev: T) => T))
  const setSorting = useCallback(
    (updaterOrValue: SortingState | ((prev: SortingState) => SortingState)) => {
      setSortingState(updaterOrValue);
      setPageState(1);
    },
    []
  );

  const setColumnVisibility = useCallback(
    (updaterOrValue: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => {
      setColumnVisibilityState(updaterOrValue);
    },
    []
  );

  const setRowSelection = useCallback(
    (updaterOrValue: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState)) => {
      setRowSelectionState(updaterOrValue);
    },
    []
  );

  const clearSelection = useCallback(() => setRowSelectionState({}), []);

  const params: TableParams = {
    page,
    pageSize,
    sortBy: sorting[0]?.id,
    sortDir: sorting[0]?.desc ? 'desc' : sorting[0]?.id ? 'asc' : undefined,
    search: search || undefined,
  };

  return {
    page,
    pageSize,
    sorting,
    setSorting,
    search,
    setSearch,
    setPage,
    setPageSize,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    clearSelection,
    params,
  };
}
