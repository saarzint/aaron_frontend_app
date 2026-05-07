import { Card as MantineCard } from '@mantine/core';
import type { CardProps } from '@mantine/core';

export default function Card(props: CardProps) {
  return <MantineCard radius="md" withBorder shadow="sm" {...props} />;
}
