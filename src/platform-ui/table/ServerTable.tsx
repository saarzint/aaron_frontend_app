import { Box, Table, Group, Alert } from '@mantine/core';
import { flexRender } from '@tanstack/react-table';
import { IconArrowUp, IconArrowDown, IconArrowsSort, IconAlertCircle } from '@tabler/icons-react';
import LoadingState from '@platform-ui/feedback/LoadingState';
import EmptyState from '@platform-ui/feedback/EmptyState';
import type { BulkAction, ServerTableInstance } from './types';
import { TableToolbar } from './TableToolbar';
import { TablePagination } from './TablePagination';
import { BulkActionsBar } from './BulkActionsBar';

interface ToolbarOptions {
  searchable?: boolean;
  exportable?: boolean;
  columnVisibility?: boolean;
  savedViews?: boolean;
  searchPlaceholder?: string;
}

interface ServerTableProps<T> {
  instance: ServerTableInstance<T>;
  toolbar?: ToolbarOptions;
  bulkActions?: BulkAction<T>[];
  emptyMessage?: string;
}

export function ServerTable<T>({
  instance,
  toolbar = {},
  bulkActions = [],
  emptyMessage = 'No records found',
}: ServerTableProps<T>) {
  const {
    table,
    query,
    params,
    pageCount,
    selectedRows,
    clearSelection,
    exportCSV,
    setPage,
    setPageSize,
  } = instance;

  const rows = table.getRowModel().rows;
  const hasData = rows.length > 0;

  return (
    <Box>
      {/* Bulk actions bar — shown when rows are selected */}
      <BulkActionsBar
        selectedRows={selectedRows}
        actions={bulkActions}
        onClear={clearSelection}
        onExportSelected={() => exportCSV('selected')}
      />

      {/* Toolbar — search, column visibility, saved views, export */}
      <TableToolbar
        instance={instance}
        searchable={toolbar.searchable ?? true}
        exportable={toolbar.exportable ?? true}
        showColumnVisibility={toolbar.columnVisibility ?? true}
        showSavedViews={toolbar.savedViews ?? true}
        searchPlaceholder={toolbar.searchPlaceholder}
      />

      {/* Error state */}
      {query.isError && (
        <Alert color="red" icon={<IconAlertCircle size={16} />} mb="sm" radius="md">
          {(query.error as { message?: string })?.message ?? 'Failed to load data'}
        </Alert>
      )}

      {/* Table or feedback states */}
      {query.isLoading ? (
        <LoadingState title="Loading records" description="Please wait while data is fetched." />
      ) : !hasData ? (
        <EmptyState title="Nothing to show" description={emptyMessage} />
      ) : (
        <Box style={{ overflowX: 'auto' }}>
          <Table striped highlightOnHover withTableBorder withColumnBorders stickyHeader>
            <Table.Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sortDir = header.column.getIsSorted();
                    return (
                      <Table.Th
                        key={header.id}
                        style={{
                          width: header.getSize() !== 150 ? header.getSize() : undefined,
                          cursor: canSort ? 'pointer' : undefined,
                          userSelect: canSort ? 'none' : undefined,
                          whiteSpace: 'nowrap',
                        }}
                        onClick={
                          canSort
                            ? (e: React.MouseEvent) => header.column.getToggleSortingHandler()?.(e)
                            : undefined
                        }
                      >
                        {header.isPlaceholder ? null : (
                          <Group gap={4} wrap="nowrap">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {canSort && (
                              <>
                                {sortDir === 'asc' ? (
                                  <IconArrowUp size={12} />
                                ) : sortDir === 'desc' ? (
                                  <IconArrowDown size={12} />
                                ) : (
                                  <IconArrowsSort size={12} style={{ opacity: 0.35 }} />
                                )}
                              </>
                            )}
                          </Group>
                        )}
                      </Table.Th>
                    );
                  })}
                </Table.Tr>
              ))}
            </Table.Thead>
            <Table.Tbody>
              {rows.map((row) => (
                <Table.Tr
                  key={row.id}
                  data-selected={row.getIsSelected() || undefined}
                  style={
                    row.getIsSelected()
                      ? { backgroundColor: 'var(--mantine-color-brand-0)' }
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <Table.Td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>
      )}

      {/* Pagination */}
      {!query.isLoading && hasData && (
        <TablePagination
          page={params.page}
          pageCount={pageCount}
          pageSize={params.pageSize}
          total={query.data?.total ?? 0}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}
    </Box>
  );
}
