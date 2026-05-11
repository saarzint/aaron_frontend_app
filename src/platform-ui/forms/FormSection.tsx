import { Divider, Stack, Text } from '@mantine/core';
import type { ReactNode } from 'react';

interface FormSectionProps {
  title?: string;
  description?: string;
  withDivider?: boolean;
  children: ReactNode;
}

export function FormSection({
  title,
  description,
  withDivider = false,
  children,
}: FormSectionProps) {
  return (
    <Stack gap="sm">
      {withDivider && <Divider />}
      {(title || description) && (
        <Stack gap={2}>
          {title && (
            <Text size="sm" fw={600}>
              {title}
            </Text>
          )}
          {description && (
            <Text size="xs" c="dimmed">
              {description}
            </Text>
          )}
        </Stack>
      )}
      {children}
    </Stack>
  );
}
