import type { NavigationConfig } from './navigationTypes';

export type AppRole = 'super_admin' | 'org_admin' | 'user';

interface RoleConfig {
  title: string;
  navigation: NavigationConfig;
}

export const ROLE_CONFIG: Record<AppRole, RoleConfig> = {
  super_admin: {
    title: 'Admin',
    navigation: {
      sections: [
        {
          id: 'main',
          label: 'Main',
          items: [
            { id: 'orders', label: 'Orders', to: '/dashboard/admin' },
            { id: 'customers', label: 'Customers', to: '/dashboard/admin/customers' },
          ],
        },
        {
          id: 'admin',
          label: 'Administration',
          items: [{ id: 'users', label: 'Users', to: '/dashboard/admin/users' }],
        },
      ],
      standaloneItems: [{ id: 'settings', label: 'Settings', to: '/dashboard/admin/settings' }],
      showBreadcrumbs: true,
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
            { id: 'orders', label: 'Orders', to: '/dashboard/org' },
            { id: 'customers', label: 'Customers', to: '/dashboard/org/customers' },
          ],
        },
      ],
      standaloneItems: [{ id: 'settings', label: 'Settings', to: '/dashboard/org/settings' }],
      showBreadcrumbs: true,
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
          items: [{ id: 'orders', label: 'Orders', to: '/dashboard/user' }],
        },
      ],
      standaloneItems: [{ id: 'settings', label: 'Settings', to: '/dashboard/user/settings' }],
      showBreadcrumbs: true,
      showSearch: false,
      showNotifications: false,
    },
  },
};

export const isAppRole = (value: string | null | undefined): value is AppRole =>
  value === 'super_admin' || value === 'org_admin' || value === 'user';
