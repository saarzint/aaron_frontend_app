import { Checkbox } from '@mantine/core';
import type { CheckboxProps } from '@mantine/core';

export default function BrandedCheckbox(props: CheckboxProps) {
  return <Checkbox radius="md" {...props} />;
}
