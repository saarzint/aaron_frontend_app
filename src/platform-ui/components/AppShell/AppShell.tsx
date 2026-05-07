import { ActionIcon, AppShell as MantineAppShell, Burger, Group, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { IconMenu2 } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@core/auth/useAuth';
import type { NavigationConfig } from '@modules/platform/config/navigationTypes';
import AppSidebar from './AppSidebar';
import AppTopbar from './AppTopbar';

interface AppShellProps {
  title: string;
  pageTitle?: string;
  navigation: NavigationConfig;
  children: ReactNode;
}

/**
 * Production-grade app shell
 * Features:
 * - Config-driven navigation
 * - Desktop collapse + mobile drawer
 * - Responsive header with breadcrumbs
 * - Tenant-aware topbar
 * - Scalable layout architecture
 */
export default function AppShell({ title, pageTitle, navigation, children }: AppShellProps) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [navbarOpened, { toggle: toggleNavbar, close: closeNavbar }] = useDisclosure();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const settingsPath =
    role === 'super_admin'
      ? '/dashboard/admin/settings'
      : role === 'org_admin'
        ? '/dashboard/org/settings'
        : '/dashboard/user/settings';

  // Calculate header height based on breadcrumbs visibility
  const headerHeight = navigation.showBreadcrumbs ? 100 : 60;

  return (
    <MantineAppShell
      header={{ height: headerHeight }}
      navbar={{
        width: sidebarCollapsed ? 0 : 240,
        breakpoint: 'md',
        collapsed: { mobile: !navbarOpened, desktop: sidebarCollapsed },
      }}
      padding="md"
    >
      {/* Header */}
      <MantineAppShell.Header>
        <Group h="100%" px="md" gap="sm" wrap="nowrap">
          {/* Mobile Burger Menu */}
          <Burger opened={navbarOpened} onClick={toggleNavbar} hiddenFrom="md" size="sm" />

          {/* Desktop Collapse Toggle */}
          <Tooltip label={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'} withArrow>
            <ActionIcon
              onClick={handleSidebarToggle}
              visibleFrom="md"
              variant="subtle"
              size="lg"
              aria-label={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
            >
              <IconMenu2 size={18} />
            </ActionIcon>
          </Tooltip>

          {/* Topbar */}
          <div style={{ flex: 1 }}>
            <AppTopbar
              userLabel={user?.email}
              roleLabel={role ?? undefined}
              pageTitle={pageTitle}
              onLogout={handleLogout}
              onSettings={() => navigate(settingsPath)}
              showBreadcrumbs={navigation.showBreadcrumbs}
              showSearch={navigation.showSearch}
              showNotifications={navigation.showNotifications}
            />
          </div>
        </Group>
      </MantineAppShell.Header>

      {/* Sidebar */}
      <MantineAppShell.Navbar>
        <AppSidebar
          title={title}
          navigation={navigation}
          onNavigate={closeNavbar}
          collapsed={sidebarCollapsed}
        />
      </MantineAppShell.Navbar>

      {/* Main Content */}
      <MantineAppShell.Main>{children}</MantineAppShell.Main>
    </MantineAppShell>
  );
}
