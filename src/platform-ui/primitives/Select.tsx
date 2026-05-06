import { Select } from '@mantine/core';
import type { SelectProps } from '@mantine/core';

export default function BrandedSelect(props: SelectProps) {
  return <Select radius="md" {...props} />;
}
