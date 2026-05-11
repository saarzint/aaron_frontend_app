import { Group, Text, Button, Paper, Tooltip } from '@mantine/core';
import { IconX, IconDownload } from '@tabler/icons-react';
import type { BulkAction } from './types';

interface BulkActionsBarProps<T> {
  selectedRows: T[];
  actions: BulkAction<T>[];
  onClear: () => void;
  onExportSelected: () => void;
}

export function BulkActionsBar<T>({
  selectedRows,
  actions,
  onClear,
  onExportSelected,
}: BulkActionsBarProps<T>) {
  if (selectedRows.length === 0) return null;

  const count = selectedRows.length;

  return (
    <Paper
      px="md"
      py="xs"
      mb="sm"
      radius="md"
      style={{
        backgroundColor: 'var(--mantine-color-brand-0)',
        border: '1px solid var(--mantine-color-brand-2)',
      }}
    >
      <Group justify="space-between" wrap="wrap" gap="xs">
        <Text size="sm" fw={500} c="brand">
          {count} row{count !== 1 ? 's' : ''} selected
        </Text>
        <Group gap="xs">
          {actions.map((action, i) => (
            <Button
              key={i}
              size="xs"
              variant={action.variant === 'danger' ? 'filled' : 'light'}
              color={action.variant === 'danger' ? 'red' : 'brand'}
              leftSection={action.icon}
              onClick={() => void action.onClick(selectedRows)}
            >
              {action.label}
            </Button>
          ))}
          <Tooltip label="Export selected rows as CSV" withArrow>
            <Button
              size="xs"
              variant="light"
              color="brand"
              leftSection={<IconDownload size={12} />}
              onClick={onExportSelected}
            >
              Export selected
            </Button>
          </Tooltip>
          <Button
            size="xs"
            variant="subtle"
            color="neutral"
            leftSection={<IconX size={12} />}
            onClick={onClear}
          >
            Clear
          </Button>
        </Group>
      </Group>
    </Paper>
  );
}
