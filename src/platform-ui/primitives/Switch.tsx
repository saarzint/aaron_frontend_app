import { Switch as MantineSwitch } from '@mantine/core';
import type { SwitchProps } from '@mantine/core';

export default function Switch(props: SwitchProps) {
  return <MantineSwitch radius="md" {...props} />;
}
