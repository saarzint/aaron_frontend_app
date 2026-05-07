import type { ReactNode } from 'react';

export interface NavigationItem {
  id: string;
  label: string;
  to?: string;
  icon?: ReactNode | string;
  description?: string;
  badge?: string | number;
}

export interface NavigationGroup {
  id: string;
  label: string;
  items: NavigationItem[];
}

export interface NavigationConfig {
  sections: NavigationGroup[];
  standaloneItems?: NavigationItem[];
  showBreadcrumbs?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
}

export interface AppShellConfig {
  title: string;
  navigation: NavigationConfig;
}

/**
 * Default empty navigation config
 */
export const defaultNavigationConfig: NavigationConfig = {
  sections: [],
  showBreadcrumbs: true,
  showSearch: true,
  showNotifications: true,
};
