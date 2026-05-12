import type { Table } from '@tanstack/react-table';

const SKIP_COLUMN_IDS = new Set(['select', 'actions']);

export function exportTableToCSV<T>(
  table: Table<T>,
  filename: string,
  mode: 'page' | 'selected' = 'page'
): void {
  const visibleCols = table.getVisibleLeafColumns().filter((col) => !SKIP_COLUMN_IDS.has(col.id));

  const headers = visibleCols.map((col) => {
    const h = col.columnDef.header;
    return typeof h === 'string' ? h : col.id;
  });

  const sourceRows =
    mode === 'selected' ? table.getSelectedRowModel().rows : table.getRowModel().rows;

  const escape = (val: unknown): string => {
    const str = val == null ? '' : String(val);
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };

  const dataRows = sourceRows.map((row) =>
    visibleCols.map((col) => {
      const cell = row.getAllCells().find((c) => c.column.id === col.id);
      return escape(cell?.getValue());
    })
  );

  const csv = [headers.map(escape).join(','), ...dataRows.map((r) => r.join(','))].join('\n');
  // UTF-8 BOM so Excel renders unicode characters correctly
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
