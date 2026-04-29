import type { SidebarItem } from '@platform-ui/components/AppShell/AppSidebar';

export type AppRole = 'super_admin' | 'org_admin' | 'user';

interface RoleConfig {
  title: string;
  modules: SidebarItem[];
}

export const ROLE_CONFIG: Record<AppRole, RoleConfig> = {
  super_admin: {
    title: 'Admin',
    modules: [
      { label: 'Orders', to: '/dashboard/admin' },
      { label: 'Customers' },
      { label: 'Users' },
      { label: 'Settings' },
    ],
  },
  org_admin: {
    title: 'Organization',
    modules: [{ label: 'Orders', to: '/dashboard/org' }, { label: 'Customers' }],
  },
  user: {
    title: 'Workspace',
    modules: [{ label: 'Orders', to: '/dashboard/user' }],
  },
};

export const isAppRole = (value: string | null | undefined): value is AppRole =>
  value === 'super_admin' || value === 'org_admin' || value === 'user';
