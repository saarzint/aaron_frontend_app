import { Group } from '@mantine/core';
import type { ReactNode } from 'react';
import Button from '@platform-ui/primitives/Button';

type Align = 'left' | 'right' | 'space-between';

const justifyMap: Record<Align, string> = {
  left: 'flex-start',
  right: 'flex-end',
  'space-between': 'space-between',
};

interface FormActionsProps {
  isDirty?: boolean;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onReset?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  resetLabel?: string;
  align?: Align;
  children?: ReactNode;
}

export function FormActions({
  isDirty = false,
  isSubmitting = false,
  onCancel,
  onReset,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  resetLabel = 'Reset',
  align = 'right',
  children,
}: FormActionsProps) {
  return (
    <Group justify={justifyMap[align]} mt="md">
      {children}
      {onReset && (
        <Button variant="ghost" type="button" onClick={onReset} disabled={!isDirty || isSubmitting}>
          {resetLabel}
        </Button>
      )}
      {onCancel && (
        <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
          {cancelLabel}
        </Button>
      )}
      <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
        {submitLabel}
      </Button>
    </Group>
  );
}
