import { TextInput as MantineTextInput } from '@mantine/core';
import type { TextInputProps } from '@mantine/core';

export default function Input(props: TextInputProps) {
  return <MantineTextInput radius="md" {...props} />;
}
