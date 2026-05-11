import { Group, TextInput, ActionIcon, Tooltip } from '@mantine/core';
import { IconSearch, IconX, IconDownload } from '@tabler/icons-react';
import type { ServerTableInstance } from './types';
import { ColumnVisibilityMenu } from './ColumnVisibilityMenu';
import { SavedViewsMenu } from './SavedViewsMenu';

interface TableToolbarProps<T> {
  instance: ServerTableInstance<T>;
  searchable?: boolean;
  exportable?: boolean;
  showColumnVisibility?: boolean;
  showSavedViews?: boolean;
  searchPlaceholder?: string;
}

export function TableToolbar<T>({
  instance,
  searchable = true,
  exportable = true,
  showColumnVisibility = true,
  showSavedViews = true,
  searchPlaceholder = 'Search…',
}: TableToolbarProps<T>) {
  return (
    <Group justify="space-between" mb="sm" wrap="wrap" gap="xs">
      <Group gap="xs">
        {searchable && (
          <TextInput
            placeholder={searchPlaceholder}
            value={instance.search}
            onChange={(e) => instance.setSearch(e.target.value)}
            leftSection={<IconSearch size={14} />}
            rightSection={
              instance.search ? (
                <ActionIcon
                  size="xs"
                  variant="transparent"
                  color="neutral"
                  onClick={() => instance.setSearch('')}
                  aria-label="Clear search"
                >
                  <IconX size={12} />
                </ActionIcon>
              ) : null
            }
            size="sm"
            w={240}
            radius="md"
          />
        )}
      </Group>
      <Group gap={4}>
        {showSavedViews && <SavedViewsMenu instance={instance} />}
        {showColumnVisibility && <ColumnVisibilityMenu table={instance.table} />}
        {exportable && (
          <Tooltip label="Export page as CSV" withArrow position="bottom">
            <ActionIcon
              variant="subtle"
              size="sm"
              color="neutral"
              onClick={() => instance.exportCSV('page')}
              aria-label="Export CSV"
            >
              <IconDownload size={16} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </Group>
  );
}
