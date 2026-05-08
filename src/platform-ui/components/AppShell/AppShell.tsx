import { AppShell as MantineAppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { ReactNode } from 'react';
import { useState } from 'react';
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

function readCollapsed(): boolean {
  try {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  } catch {
    return false;
  }
}

function writeCollapsed(value: boolean) {
  try {
    localStorage.setItem('sidebarCollapsed', String(value));
  } catch {
    /* ignore */
  }
}

export default function AppShell({ title, pageTitle, navigation, children }: AppShellProps) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [navbarOpened, { toggle: toggleNavbar, close: closeNavbar }] = useDisclosure();

  // Persisted across page remounts via localStorage
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(readCollapsed);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      writeCollapsed(next);
      return next;
    });
  };

  return (
    <MantineAppShell
      layout="alt"
      header={{ height: 60 }}
      navbar={{
        width: sidebarCollapsed ? 72 : 240,
        breakpoint: 'md',
        collapsed: { mobile: !navbarOpened },
      }}
      padding="lg"
      styles={{
        main: {
          backgroundColor: 'var(--mantine-color-body)',
          minHeight: '100vh',
        },
        header: {
          borderBottom: '1px solid var(--mantine-color-default-border)',
        },
        navbar: {
          borderRight: '1px solid var(--mantine-color-default-border)',
        },
      }}
    >
      <MantineAppShell.Header>
        <Group h="100%" px="md" gap="sm" wrap="nowrap">
          <Burger opened={navbarOpened} onClick={toggleNavbar} hiddenFrom="md" size="sm" />

          <AppTopbar
            userLabel={user?.email}
            roleLabel={role ?? undefined}
            pageTitle={pageTitle}
            onLogout={handleLogout}
            onSettings={() => navigate('/settings')}
            showSearch={navigation.showSearch}
            showNotifications={navigation.showNotifications}
          />
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Navbar>
        <AppSidebar
          title={title}
          navigation={navigation}
          onNavigate={closeNavbar}
          collapsed={sidebarCollapsed}
          onToggle={handleSidebarToggle}
          onLogout={handleLogout}
        />
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>{children}</MantineAppShell.Main>
    </MantineAppShell>
  );
}
