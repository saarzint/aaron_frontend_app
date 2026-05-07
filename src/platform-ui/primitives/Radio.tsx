import { Radio as MantineRadio } from '@mantine/core';
import type { RadioProps } from '@mantine/core';

export default function Radio(props: RadioProps) {
  return <MantineRadio radius="md" {...props} />;
}
