import type { NavigationConfig } from './navigationTypes';

export type AppRole = 'super_admin' | 'org_admin' | 'user';

interface RoleConfig {
  title: string;
  navigation: NavigationConfig;
}

export const ROLE_CONFIG: Record<AppRole, RoleConfig> = {
  super_admin: {
    title: 'Admin Platform',
    navigation: {
      sections: [
        {
          id: 'main',
          label: 'Main',
          items: [
            { id: 'dashboard', label: 'Dashboard', to: '/dashboard' },
            { id: 'orders', label: 'Orders', to: '/orders' },
            { id: 'customers', label: 'Customers', to: '/customers' },
          ],
        },
        {
          id: 'admin',
          label: 'Administration',
          items: [{ id: 'users', label: 'Users', to: '/users' }],
        },
        {
          id: 'system',
          label: 'System',
          items: [{ id: 'settings', label: 'Settings', to: '/settings' }],
        },
      ],
      showSearch: true,
      showNotifications: true,
    },
  },
  org_admin: {
    title: 'Organization',
    navigation: {
      sections: [
        {
          id: 'main',
          label: 'Main',
          items: [
            { id: 'dashboard', label: 'Dashboard', to: '/dashboard' },
            { id: 'orders', label: 'Orders', to: '/orders' },
            { id: 'customers', label: 'Customers', to: '/customers' },
          ],
        },
        {
          id: 'system',
          label: 'System',
          items: [{ id: 'settings', label: 'Settings', to: '/settings' }],
        },
      ],
      showSearch: true,
      showNotifications: true,
    },
  },
  user: {
    title: 'Workspace',
    navigation: {
      sections: [
        {
          id: 'main',
          label: 'Main',
          items: [
            { id: 'dashboard', label: 'Dashboard', to: '/dashboard' },
            { id: 'orders', label: 'Orders', to: '/orders' },
          ],
        },
        {
          id: 'system',
          label: 'System',
          items: [{ id: 'settings', label: 'Settings', to: '/settings' }],
        },
      ],
      showSearch: true,
      showNotifications: true,
    },
  },
};

export const isAppRole = (value: string | null | undefined): value is AppRole =>
  value === 'super_admin' || value === 'org_admin' || value === 'user';
