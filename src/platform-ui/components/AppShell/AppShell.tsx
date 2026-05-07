import { AppShell as MantineAppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@core/auth/useAuth';
import AppSidebar, { type SidebarItem } from './AppSidebar';
import AppTopbar from './AppTopbar';

interface AppShellProps {
  title: string;
  navItems: SidebarItem[];
  children: ReactNode;
}

export default function AppShell({ title, navItems, children }: AppShellProps) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [navbarOpened, { toggle: toggleNavbar, close: closeNavbar }] = useDisclosure();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <MantineAppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !navbarOpened } }}
      padding="md"
    >
      <MantineAppShell.Header>
        <Group h="100%" px="md" gap="sm" wrap="nowrap" style={{ flex: 1 }}>
          <Burger opened={navbarOpened} onClick={toggleNavbar} hiddenFrom="sm" size="sm" />
          <div style={{ flex: 1 }}>
            <AppTopbar
              userLabel={user?.email}
              roleLabel={role ?? undefined}
              onLogout={handleLogout}
            />
          </div>
        </Group>
      </MantineAppShell.Header>
      <MantineAppShell.Navbar>
        <AppSidebar title={title} items={navItems} onNavigate={closeNavbar} />
      </MantineAppShell.Navbar>
      <MantineAppShell.Main>{children}</MantineAppShell.Main>
    </MantineAppShell>
  );
}
