import { Select as MantineSelect } from '@mantine/core';
import type { SelectProps } from '@mantine/core';

export default function Select(props: SelectProps) {
  return <MantineSelect radius="md" {...props} />;
}
