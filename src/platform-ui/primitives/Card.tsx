import { Card } from '@mantine/core';
import type { CardProps } from '@mantine/core';

export default function BrandedCard(props: CardProps) {
  return <Card radius="md" withBorder shadow="sm" {...props} />;
}
