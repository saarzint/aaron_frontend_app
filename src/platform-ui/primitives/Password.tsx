import { PasswordInput as MantinePasswordInput } from '@mantine/core';
import type { PasswordInputProps } from '@mantine/core';

export default function Password(props: PasswordInputProps) {
  return <MantinePasswordInput radius="md" {...props} />;
}
