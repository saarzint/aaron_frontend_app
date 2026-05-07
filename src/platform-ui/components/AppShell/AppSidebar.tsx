import { NavLink, Stack, Text } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';

export interface SidebarItem {
  label: string;
  to?: string;
  description?: string;
}

interface AppSidebarProps {
  title: string;
  items: SidebarItem[];
  onNavigate?: () => void;
}

export default function AppSidebar({ title, items, onNavigate }: AppSidebarProps) {
  const location = useLocation();

  return (
    <Stack gap="xs" p="md">
      <Text fw={600} size="lg" mb="md">
        {title}
      </Text>
      {items.map((item) => (
        <NavLink
          key={item.label}
          label={item.label}
          description={item.description}
          component={Link}
          to={item.to ?? '#'}
          onClick={onNavigate}
          active={Boolean(item.to && location.pathname === item.to)}
          styles={(theme) => ({
            root: {
              '&[data-active]': {
                backgroundColor: theme.colors.brand[0],
                color: theme.colors.brand[7],
                fontWeight: 600,
              },
              '&[data-active]:hover': {
                backgroundColor: theme.colors.brand[1],
              },
            },
          })}
        />
      ))}
    </Stack>
  );
}
