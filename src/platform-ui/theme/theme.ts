import { createTheme, type MantineColorsTuple } from '@mantine/core';

const brand: MantineColorsTuple = [
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

export const theme = createTheme({
  primaryColor: 'brand',
  colors: { brand },
  defaultRadius: 'md',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
  headings: { fontWeight: '600' },
  cursorType: 'pointer',
});
