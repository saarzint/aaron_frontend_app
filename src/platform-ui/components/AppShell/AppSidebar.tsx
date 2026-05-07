import { Group, NavLink, ScrollArea, Stack, Text, UnstyledButton } from '@mantine/core';
import { IconChevronDown, IconSettings } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import type {
  NavigationConfig,
  NavigationGroup,
  NavigationItem,
} from '@modules/platform/config/navigationTypes';

interface AppSidebarProps {
  title: string;
  navigation: NavigationConfig;
  onNavigate?: () => void;
  collapsed?: boolean;
}

/**
 * Scalable collapsible sidebar
 * Supports:
 * - Navigation groups and sections
 * - Active route highlighting
 * - Desktop collapse behavior
 * - Mobile drawer integration
 * - Icon support (future)
 */
export default function AppSidebar({
  title,
  navigation,
  onNavigate,
  collapsed = false,
}: AppSidebarProps) {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    navigation.sections.reduce((acc, section) => ({ ...acc, [section.id]: true }), {})
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const isItemActive = (to?: string) => {
    if (!to) return false;

    const currentPath = location.pathname.replace(/\/+$/, '');
    const targetPath = to.replace(/\/+$/, '');

    return currentPath === targetPath;
  };

  return (
    <Stack h="100%" gap={0} p="md" pb="xl">
      {/* Sidebar Title */}
      {!collapsed && (
        <Group justify="space-between" align="center" mb="md" wrap="nowrap">
          <Text fw={600} size="lg" truncate title={title}>
            {title}
          </Text>
        </Group>
      )}

      <ScrollArea style={{ flex: 1 }}>
        <Stack gap={0}>
          {/* Navigation Sections */}
          {navigation.sections.length === 0 ? (
            <Text size="sm" c="neutral.5" ta="center" py="lg">
              No navigation items
            </Text>
          ) : (
            navigation.sections.map((section) => (
              <SidebarSection
                key={section.id}
                section={section}
                isExpanded={expandedSections[section.id] ?? true}
                onToggle={() => toggleSection(section.id)}
                isItemActive={isItemActive}
                onNavigate={onNavigate}
                collapsed={collapsed}
              />
            ))
          )}
        </Stack>
      </ScrollArea>

      {!collapsed && navigation.standaloneItems && navigation.standaloneItems.length > 0 && (
        <Stack gap="xs" pt="md">
          {navigation.standaloneItems.map((item) => (
            <StandaloneNavItem
              key={item.id}
              item={item}
              isActive={isItemActive}
              onNavigate={onNavigate}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

interface SidebarSectionProps {
  section: NavigationGroup;
  isExpanded: boolean;
  onToggle: () => void;
  isItemActive: (to?: string) => boolean;
  onNavigate?: () => void;
  collapsed?: boolean;
}

function SidebarSection({
  section,
  isExpanded,
  onToggle,
  isItemActive,
  onNavigate,
  collapsed,
}: SidebarSectionProps) {
  return (
    <Stack gap={0} mb="sm">
      {/* Section Header */}
      {!collapsed && section.label && (
        <UnstyledButton onClick={onToggle} p={0} mb="xs" style={{ width: '100%' }}>
          <Group justify="space-between" align="center" wrap="nowrap">
            <Text size="xs" fw={700} c="neutral.5" tt="uppercase">
              {section.label}
            </Text>
            <IconChevronDown
              size={14}
              style={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 150ms ease',
              }}
            />
          </Group>
        </UnstyledButton>
      )}

      {/* Section Items - Conditionally Rendered */}
      {isExpanded && (
        <Stack gap="xs" mt="xs">
          {section.items.map((item) => (
            <NavLink
              key={item.id}
              label={item.label}
              description={item.description}
              component={Link}
              to={item.to ?? '#'}
              onClick={onNavigate}
              active={isItemActive(item.to)}
              title={item.label}
              styles={(theme) => ({
                root: {
                  borderRadius: 6,
                  '&[data-active]': {
                    backgroundColor: theme.colors.brand[0],
                    color: theme.colors.brand[7],
                    fontWeight: 600,
                  },
                  '&[data-active]:hover': {
                    backgroundColor: theme.colors.brand[1],
                  },
                  '&:hover': {
                    backgroundColor: theme.colors.neutral[1],
                  },
                },
              })}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

interface StandaloneNavItemProps {
  item: NavigationItem;
  isActive: (to?: string) => boolean;
  onNavigate?: () => void;
}

function StandaloneNavItem({ item, isActive, onNavigate }: StandaloneNavItemProps) {
  return (
    <NavLink
      label={item.label}
      description={item.description}
      leftSection={<IconSettings size={16} />}
      component={Link}
      to={item.to ?? '#'}
      onClick={onNavigate}
      active={isActive(item.to)}
      title={item.label}
      styles={(theme) => ({
        root: {
          borderRadius: 6,
          '&[data-active]': {
            backgroundColor: theme.colors.brand[0],
            color: theme.colors.brand[7],
            fontWeight: 600,
          },
          '&[data-active]:hover': {
            backgroundColor: theme.colors.brand[1],
          },
          '&:hover': {
            backgroundColor: theme.colors.neutral[1],
          },
        },
      })}
    />
  );
}

export type { NavigationGroup } from '@modules/platform/config/navigationTypes';
