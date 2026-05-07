import { Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';

type Variant = 'heading' | 'body' | 'caption';

interface Props {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

export default function Typography({ variant = 'body', children, className }: Props) {
  if (variant === 'heading') {
    return (
      <Title order={3} className={className} c="brand.7">
        {children}
      </Title>
    );
  }

  if (variant === 'caption') {
    return (
      <Text size="xs" c="neutral.6" className={className}>
        {children}
      </Text>
    );
  }

  return <Text className={className}>{children}</Text>;
}
