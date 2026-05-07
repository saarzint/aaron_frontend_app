import { Badge } from '@mantine/core';
import type { BadgeProps } from '@mantine/core';

type Variant = 'primary' | 'neutral' | 'success' | 'warning' | 'danger';

interface Props extends Omit<BadgeProps, 'variant' | 'color'> {
  variant?: Variant;
}

const variants: Record<Variant, Pick<BadgeProps, 'variant' | 'color'>> = {
  primary: { variant: 'light', color: 'brand' },
  neutral: { variant: 'light', color: 'neutral' },
  success: { variant: 'light', color: 'success' },
  warning: { variant: 'light', color: 'warning' },
  danger: { variant: 'light', color: 'danger' },
};

export default function BrandedBadge({ variant = 'neutral', children, ...rest }: Props) {
  return (
    <Badge {...variants[variant]} {...rest}>
      {children}
    </Badge>
  );
}
