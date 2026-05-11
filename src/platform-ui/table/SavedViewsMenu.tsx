import { useState } from 'react';
import {
  Popover,
  Stack,
  Group,
  Text,
  Button,
  TextInput,
  Divider,
  ActionIcon,
  ScrollArea,
} from '@mantine/core';
import { IconBookmark, IconChevronDown, IconTrash, IconCheck } from '@tabler/icons-react';
import type { ServerTableInstance } from './types';

interface SavedViewsMenuProps<T> {
  instance: ServerTableInstance<T>;
}

export function SavedViewsMenu<T>({ instance }: SavedViewsMenuProps<T>) {
  const [opened, setOpened] = useState(false);
  const [newName, setNewName] = useState('');
  const { views, save, apply, remove } = instance.savedViews;

  const handleSave = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    save(trimmed);
    setNewName('');
  };

  return (
    <Popover opened={opened} onChange={setOpened} position="bottom-end" withinPortal shadow="md">
      <Popover.Target>
        <Button
          variant="subtle"
          size="xs"
          leftSection={<IconBookmark size={14} />}
          rightSection={<IconChevronDown size={12} />}
          onClick={() => setOpened((o) => !o)}
          color="neutral"
        >
          Views{views.length > 0 ? ` (${views.length})` : ''}
        </Button>
      </Popover.Target>
      <Popover.Dropdown w={230}>
        <Stack gap="sm">
          {views.length > 0 && (
            <>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                Saved Views
              </Text>
              <ScrollArea.Autosize mah={160}>
                <Stack gap={4}>
                  {views.map((view) => (
                    <Group key={view.id} justify="space-between" wrap="nowrap" gap="xs">
                      <Text
                        size="sm"
                        style={{ cursor: 'pointer', flex: 1, minWidth: 0 }}
                        truncate
                        onClick={() => {
                          apply(view);
                          setOpened(false);
                        }}
                      >
                        {view.name}
                      </Text>
                      <ActionIcon
                        size="xs"
                        variant="subtle"
                        color="red"
                        onClick={() => remove(view.id)}
                        aria-label={`Delete view ${view.name}`}
                      >
                        <IconTrash size={12} />
                      </ActionIcon>
                    </Group>
                  ))}
                </Stack>
              </ScrollArea.Autosize>
              <Divider />
            </>
          )}
          <Text size="xs" fw={600} c="dimmed" tt="uppercase">
            Save Current View
          </Text>
          <Group gap="xs" align="flex-end">
            <TextInput
              placeholder="View name"
              size="xs"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
              }}
              style={{ flex: 1 }}
            />
            <ActionIcon
              size="sm"
              variant="filled"
              color="brand"
              disabled={!newName.trim()}
              onClick={handleSave}
              aria-label="Save view"
            >
              <IconCheck size={14} />
            </ActionIcon>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
