import { Checkbox as MantineCheckbox } from '@mantine/core';
import type { CheckboxProps } from '@mantine/core';

export default function Checkbox(props: CheckboxProps) {
  return <MantineCheckbox radius="md" {...props} />;
}
