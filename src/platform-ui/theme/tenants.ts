import type { MantineColorsTuple } from '@mantine/core';

export interface TenantConfig {
  id: string;
  name: string;
  brand?: MantineColorsTuple;
  fontFamily?: string;
  logoUrl?: string;
}

export const TENANTS: Record<string, TenantConfig> = {
  default: {
    id: 'default',
    name: 'Default',
  },
  acme: {
    id: 'acme',
    name: 'Acme Corp',
    brand: [
      '#fff7ed',
      '#ffe7cc',
      '#ffd7aa',
      '#ffb677',
      '#ff9644',
      '#ff7a22',
      '#ff6a00',
      '#e55a00',
      '#cc4a00',
      '#993300',
    ],
    fontFamily: 'Inter, system-ui, -apple-system, Roboto, "Segoe UI", sans-serif',
  },
  northstar: {
    id: 'northstar',
    name: 'Northstar',
    brand: [
      '#eef2ff',
      '#e0e7ff',
      '#c7d2fe',
      '#a5b4fc',
      '#818cf8',
      '#6366f1',
      '#4f46e5',
      '#4338ca',
      '#3730a3',
      '#312e81',
    ],
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, sans-serif',
  },
};
