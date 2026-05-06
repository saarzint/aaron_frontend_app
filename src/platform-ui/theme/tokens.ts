import { createTheme, type MantineColorsTuple } from '@mantine/core';

export const brandPalette: MantineColorsTuple = [
  '#eef4ff',
  '#dce4f5',
  '#b9c7e2',
  '#94a8d0',
  '#748dc0',
  '#5f7cb7',
  '#5474b4',
  '#43639f',
  '#39588f',
  '#2d4d80',
];

export const neutralPalette: MantineColorsTuple = [
  '#f8fafc',
  '#f1f5f9',
  '#e2e8f0',
  '#cbd5e1',
  '#94a3b8',
  '#64748b',
  '#475569',
  '#334155',
  '#1e293b',
  '#0f172a',
];

export const successPalette: MantineColorsTuple = [
  '#ecfdf3',
  '#d1fae5',
  '#a7f3d0',
  '#6ee7b7',
  '#34d399',
  '#10b981',
  '#059669',
  '#047857',
  '#065f46',
  '#064e3b',
];

export const warningPalette: MantineColorsTuple = [
  '#fff7ed',
  '#ffedd5',
  '#fed7aa',
  '#fdba74',
  '#fb923c',
  '#f97316',
  '#ea580c',
  '#c2410c',
  '#9a3412',
  '#7c2d12',
];

export const dangerPalette: MantineColorsTuple = [
  '#fef2f2',
  '#fee2e2',
  '#fecaca',
  '#fca5a5',
  '#f87171',
  '#ef4444',
  '#dc2626',
  '#b91c1c',
  '#991b1b',
  '#7f1d1d',
];

export const createAppTheme = ({
  brand = brandPalette,
  fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
}: {
  brand?: MantineColorsTuple;
  fontFamily?: string;
} = {}) =>
  createTheme({
    primaryColor: 'brand',
    colors: {
      brand,
      neutral: neutralPalette,
      success: successPalette,
      warning: warningPalette,
      danger: dangerPalette,
    },
    defaultRadius: 'md',
    fontFamily,
    headings: { fontWeight: '600' },
    cursorType: 'pointer',
  });
