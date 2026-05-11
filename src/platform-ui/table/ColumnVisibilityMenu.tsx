import { useState } from 'react';
import { Popover, Stack, Group, Text, Button, Divider } from '@mantine/core';
import { Checkbox } from '@mantine/core';
import { IconColumns, IconChevronDown } from '@tabler/icons-react';
import type { Table } from '@tanstack/react-table';

interface ColumnVisibilityMenuProps<T> {
  table: Table<T>;
}

export function ColumnVisibilityMenu<T>({ table }: ColumnVisibilityMenuProps<T>) {
  const [opened, setOpened] = useState(false);

  const toggleableColumns = table.getAllLeafColumns().filter((col) => col.getCanHide());

  return (
    <Popover opened={opened} onChange={setOpened} position="bottom-end" withinPortal shadow="md">
      <Popover.Target>
        <Button
          variant="subtle"
          size="xs"
          leftSection={<IconColumns size={14} />}
          rightSection={<IconChevronDown size={12} />}
          onClick={() => setOpened((o) => !o)}
          color="neutral"
        >
          Columns
        </Button>
      </Popover.Target>
      <Popover.Dropdown w={200}>
        <Stack gap="xs">
          <Group justify="space-between" align="center">
            <Text size="xs" fw={600} c="dimmed" tt="uppercase">
              Columns
            </Text>
            <Button
              size="xs"
              variant="subtle"
              p={0}
              h="auto"
              onClick={() => table.resetColumnVisibility()}
            >
              Reset
            </Button>
          </Group>
          <Divider />
          {toggleableColumns.map((col) => {
            const label = typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id;
            return (
              <Checkbox
                key={col.id}
                size="sm"
                label={label}
                checked={col.getIsVisible()}
                onChange={col.getToggleVisibilityHandler()}
              />
            );
          })}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
