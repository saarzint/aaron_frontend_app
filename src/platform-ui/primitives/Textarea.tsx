import { Textarea as MantineTextarea } from '@mantine/core';
import type { TextareaProps } from '@mantine/core';

export default function Textarea(props: TextareaProps) {
  return <MantineTextarea radius="md" {...props} />;
}
