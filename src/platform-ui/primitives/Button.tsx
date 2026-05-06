import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button as MantineButton } from '@mantine/core';
import type { ButtonProps as MantineButtonProps } from '@mantine/core';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

type Props = Omit<MantineButtonProps, 'variant' | 'color'> &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    children?: ReactNode;
  };

const variants = {
  primary: { variant: 'filled' as const, color: 'brand' },
  secondary: { variant: 'light' as const, color: 'neutral' },
  outline: { variant: 'outline' as const, color: 'brand' },
  ghost: { variant: 'subtle' as const, color: 'brand' },
  danger: { variant: 'filled' as const, color: 'danger' },
};

export default function Button({ variant = 'primary', children, ...rest }: Props) {
  return (
    <MantineButton {...variants[variant]} {...rest}>
      {children}
    </MantineButton>
  );
}
