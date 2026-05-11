import { Group, Pagination, Select, Text } from '@mantine/core';

const PAGE_SIZE_OPTIONS = ['10', '25', '50', '100'];

interface TablePaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function TablePagination({
  page,
  pageCount,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const start = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, total);

  return (
    <Group justify="space-between" mt="sm" wrap="wrap" gap="xs">
      <Group gap="xs" align="center">
        <Text size="sm" c="dimmed">
          {total > 0 ? `${start}–${end} of ${total}` : '0 records'}
        </Text>
        <Select
          size="xs"
          value={String(pageSize)}
          onChange={(val) => {
            if (val) onPageSizeChange(Number(val));
          }}
          data={PAGE_SIZE_OPTIONS}
          w={68}
          radius="md"
          aria-label="Rows per page"
        />
        <Text size="sm" c="dimmed">
          per page
        </Text>
      </Group>
      {pageCount > 1 && (
        <Pagination value={page} total={pageCount} onChange={onPageChange} size="sm" />
      )}
    </Group>
  );
}
