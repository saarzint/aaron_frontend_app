import { Center, Stack, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import Button from '@platform-ui/primitives/Button';
import Typography from '@platform-ui/primitives/Typography';

interface Props {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export default function EmptyState({ title, description, actionLabel, onAction, icon }: Props) {
  return (
    <Center py="xl">
      <Stack align="center" gap="sm" maw={420} ta="center">
        {icon}
        <Typography variant="heading">{title}</Typography>
        {description && (
          <Text size="sm" c="neutral.6">
            {description}
          </Text>
        )}
        {actionLabel && onAction && (
          <Button variant="outline" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Center>
  );
}
