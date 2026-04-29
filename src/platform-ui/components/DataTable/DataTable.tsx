import { Center, Loader, Table, Text } from '@mantine/core';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';

interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[];
  data: T[] | undefined;
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyMessage = 'No records to display',
}: DataTableProps<T>) {
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Center py="xl">
        <Text c="dimmed" size="sm">
          {emptyMessage}
        </Text>
      </Center>
    );
  }

  return (
    <Table striped highlightOnHover withTableBorder withColumnBorders>
      <Table.Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Table.Th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </Table.Th>
            ))}
          </Table.Tr>
        ))}
      </Table.Thead>
      <Table.Tbody>
        {table.getRowModel().rows.map((row) => (
          <Table.Tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Table.Td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
