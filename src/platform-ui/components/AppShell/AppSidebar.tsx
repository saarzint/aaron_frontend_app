import { NavLink, Stack, Text } from '@mantine/core';

export interface SidebarItem {
  label: string;
  to?: string;
  description?: string;
}

interface AppSidebarProps {
  title: string;
  items: SidebarItem[];
}

export default function AppSidebar({ title, items }: AppSidebarProps) {
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
          href={item.to ?? '#'}
        />
      ))}
    </Stack>
  );
}
