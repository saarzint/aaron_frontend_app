import { Textarea } from '@mantine/core';
import type { TextareaProps } from '@mantine/core';

export default function BrandedTextarea(props: TextareaProps) {
  return <Textarea radius="md" {...props} />;
}
