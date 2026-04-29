import { AppShell as MantineAppShell } from '@mantine/core';
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <MantineAppShell header={{ height: 60 }} navbar={{ width: 240, breakpoint: 'sm' }} padding="md">
      <MantineAppShell.Header>
        <AppTopbar userLabel={user?.email} roleLabel={role ?? undefined} onLogout={handleLogout} />
      </MantineAppShell.Header>
      <MantineAppShell.Navbar>
        <AppSidebar title={title} items={navItems} />
      </MantineAppShell.Navbar>
      <MantineAppShell.Main>{children}</MantineAppShell.Main>
    </MantineAppShell>
  );
}
