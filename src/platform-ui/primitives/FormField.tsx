import { Stack, Text } from '@mantine/core';
import type { ReactNode } from 'react';

interface Props {
  label?: string;
  description?: string;
  error?: string | boolean | undefined;
  success?: string;
  disabled?: boolean;
  required?: boolean;
  children: ReactNode;
}

export default function FormField({
  label,
  description,
  error,
  success,
  disabled,
  required,
  children,
}: Props) {
  return (
    <Stack gap={6} aria-disabled={disabled || undefined}>
      {label && (
        <Text size="sm" fw={600} component="label">
          {label}
          {required ? (
            <Text component="span" c="danger">
              *
            </Text>
          ) : null}
        </Text>
      )}
      {children}
      {description && !error && !success && (
        <Text size="xs" c="neutral.6">
          {description}
        </Text>
      )}
      {error && typeof error === 'string' && (
        <Text size="xs" c="danger">
          {error}
        </Text>
      )}
      {success && !error && (
        <Text size="xs" c="success">
          {success}
        </Text>
      )}
    </Stack>
  );
}
