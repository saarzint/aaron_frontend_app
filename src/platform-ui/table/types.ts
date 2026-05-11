import type { ColumnDef, SortingState, VisibilityState, Table } from '@tanstack/react-table';
import type { UseQueryResult, QueryKey } from '@tanstack/react-query';
import type { ReactNode } from 'react';

export interface TableParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  search?: string;
}

export interface TableResponse<T> {
  data: T[];
  total: number;
}

export interface TableViewState {
  sorting: SortingState;
  columnVisibility: VisibilityState;
  pageSize: number;
  search: string;
}

export interface SavedView {
  id: string;
  name: string;
  state: TableViewState;
  createdAt: number;
}

export interface BulkAction<T> {
  label: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick: (selectedRows: T[]) => void | Promise<void>;
}

export interface UseServerTableOptions<T> {
  queryKey: QueryKey;
  queryFn: (params: TableParams) => Promise<TableResponse<T>>;
  columns: ColumnDef<T, unknown>[];
  defaultPageSize?: number;
  savedViewKey?: string;
  enableRowSelection?: boolean;
  filename?: string;
}

export interface ServerTableInstance<T> {
  table: Table<T>;
  query: UseQueryResult<TableResponse<T>>;
  params: TableParams;
  search: string;
  setSearch: (s: string) => void;
  setPage: (p: number) => void;
  setPageSize: (s: number) => void;
  pageCount: number;
  selectedRows: T[];
  clearSelection: () => void;
  exportCSV: (mode?: 'page' | 'selected') => void;
  filename: string;
  savedViews: {
    views: SavedView[];
    save: (name: string) => void;
    apply: (view: SavedView) => void;
    remove: (id: string) => void;
  };
}
