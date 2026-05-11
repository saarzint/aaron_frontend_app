import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Checkbox } from '@mantine/core';
import { useReactTable, getCoreRowModel, type ColumnDef } from '@tanstack/react-table';
import { useTenantContext } from '@core/tenant/TenantContext';
import { useAuth } from '@core/auth/useAuth';
import { useTenantQueryKeys } from '@config/queryConfig';
import { useTableState } from './useTableState';
import { useSavedViews } from './useSavedViews';
import { exportTableToCSV } from './useCSVExport';
import type {
  UseServerTableOptions,
  ServerTableInstance,
  TableViewState,
  TableResponse,
} from './types';

export function useServerTable<T extends object>({
  queryKey,
  queryFn,
  columns: userColumns,
  defaultPageSize = 10,
  savedViewKey,
  enableRowSelection = true,
  filename,
}: UseServerTableOptions<T>): ServerTableInstance<T> {
  const state = useTableState({ defaultPageSize });
  const tenantKeys = useTenantQueryKeys();
  const { tenantId } = useTenantContext();
  const { user } = useAuth();

  // Stable user identifier for storage scoping; falls back to 'guest' before auth resolves
  const userId = user?.email ?? 'guest';

  const tableKey =
    savedViewKey ?? (Array.isArray(queryKey) ? queryKey.map(String).join('-') : String(queryKey));

  // Views scoped to tableViews:{tenantId}:{userId}:{tableKey} — no cross-user bleed
  const { views, save: saveView, remove: removeView } = useSavedViews(tenantId, userId, tableKey);

  const exportFilename = filename ?? `${tableKey}-export.csv`;

  // Full tenant-scoped React Query key; includes params so state changes trigger refetch
  const query = useQuery<TableResponse<T>>({
    queryKey: [...tenantKeys.all, ...queryKey, state.params],
    queryFn: () => queryFn(state.params),
    placeholderData: (prev) => prev,
  });

  const selectColumn = useMemo<ColumnDef<T, unknown>>(
    () => ({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          size="sm"
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          aria-label="Select all rows"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          size="sm"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
          aria-label="Select row"
        />
      ),
      size: 48,
      enableSorting: false,
      enableHiding: false,
    }),
    []
  );

  const columns = useMemo<ColumnDef<T, unknown>[]>(
    () => (enableRowSelection ? [selectColumn, ...userColumns] : userColumns),
    [enableRowSelection, selectColumn, userColumns]
  );

  const pageCount = query.data ? Math.ceil(query.data.total / state.pageSize) : -1;

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<T>({
    data: query.data?.data ?? [],
    columns,
    pageCount,
    state: {
      sorting: state.sorting,
      columnVisibility: state.columnVisibility,
      rowSelection: state.rowSelection,
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableRowSelection,
    onSortingChange: state.setSorting,
    onColumnVisibilityChange: state.setColumnVisibility,
    onRowSelectionChange: state.setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedRows = useMemo(() => {
    const data = query.data?.data ?? [];
    return Object.keys(state.rowSelection)
      .filter((idx) => state.rowSelection[idx])
      .map((idx) => data[Number(idx)])
      .filter((row): row is T => row !== undefined);
  }, [state.rowSelection, query.data?.data]);

  const currentViewState = useCallback(
    (): TableViewState => ({
      sorting: state.sorting,
      columnVisibility: state.columnVisibility,
      pageSize: state.pageSize,
      search: state.search,
    }),
    [state.sorting, state.columnVisibility, state.pageSize, state.search]
  );

  const applyView = useCallback(
    (view: { state: TableViewState }) => {
      state.setSorting(view.state.sorting);
      state.setColumnVisibility(view.state.columnVisibility);
      state.setPageSize(view.state.pageSize);
      state.setSearch(view.state.search);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.setSorting, state.setColumnVisibility, state.setPageSize, state.setSearch]
  );

  const exportCSV = useCallback(
    (mode: 'page' | 'selected' = 'page') => {
      exportTableToCSV(table, exportFilename, mode);
    },
    [table, exportFilename]
  );

  return {
    table,
    query,
    params: state.params,
    search: state.search,
    setSearch: state.setSearch,
    setPage: state.setPage,
    setPageSize: state.setPageSize,
    pageCount: query.data ? Math.ceil(query.data.total / state.pageSize) : 0,
    selectedRows,
    clearSelection: state.clearSelection,
    exportCSV,
    filename: exportFilename,
    savedViews: {
      views,
      save: (name: string) => saveView(name, currentViewState()),
      apply: applyView,
      remove: removeView,
    },
  };
}
