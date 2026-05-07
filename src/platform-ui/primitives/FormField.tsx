import { Stack, Text } from '@mantine/core';
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';

interface Props {
  label?: string;
  description?: string;
  error?: string | boolean | undefined;
  success?: string;
  disabled?: boolean;
  required?: boolean;
  children: ReactNode;
}

interface InjectedChildProps {
  error?: ReactNode;
  'aria-invalid'?: boolean;
  disabled?: boolean;
  required?: boolean;
}

const injectIntoControl = (child: ReactNode, injected: InjectedChildProps): ReactNode => {
  if (!isValidElement(child)) return child;
  return cloneElement(child as ReactElement<InjectedChildProps>, injected);
};

export default function FormField({
  label,
  description,
  error,
  success,
  disabled,
  required,
  children,
}: Props) {
  const errorText = typeof error === 'string' ? error : undefined;
  const isErrored = Boolean(error);

  const enhancedChildren = Children.map(children, (child) =>
    injectIntoControl(child, {
      error: errorText || (isErrored ? true : undefined),
      'aria-invalid': isErrored || undefined,
      disabled: disabled || undefined,
      required: required || undefined,
    })
  );

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
      {enhancedChildren}
      {description && !error && !success && (
        <Text size="xs" c="neutral.6">
          {description}
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
