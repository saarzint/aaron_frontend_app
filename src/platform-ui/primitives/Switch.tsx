import { Switch } from '@mantine/core';
import type { SwitchProps } from '@mantine/core';

export default function BrandedSwitch(props: SwitchProps) {
  return <Switch radius="md" {...props} />;
}
