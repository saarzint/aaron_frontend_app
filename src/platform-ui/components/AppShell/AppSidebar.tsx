import {
  ActionIcon,
  Avatar,
  Box,
  Divider,
  Group,
  NavLink,
  ScrollArea,
  Stack,
  Switch,
  Text,
  Tooltip,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconChevronDown,
  IconLayoutDashboard,
  IconShoppingCart,
  IconUsers,
  IconUserCog,
  IconSettings,
  IconLogout,
  IconMoon,
  IconSun,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from '@tabler/icons-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  NavigationConfig,
  NavigationGroup,
  NavigationItem,
} from '@modules/platform/config/navigationTypes';
import { useTenantContext } from '@core/tenant/TenantContext';
import { useAuth } from '@core/auth/useAuth';

const NAV_ICONS: Record<string, React.ComponentType<{ size?: number; stroke?: number }>> = {
  dashboard: IconLayoutDashboard,
  orders: IconShoppingCart,
  customers: IconUsers,
  users: IconUserCog,
  settings: IconSettings,
};

interface AppSidebarProps {
  title: string;
  navigation: NavigationConfig;
  onNavigate?: () => void;
  onToggle?: () => void;
  collapsed?: boolean;
  onLogout?: () => void;
}

export default function AppSidebar({
  title,
  navigation,
  onNavigate,
  onToggle,
  collapsed = false,
  onLogout,
}: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { tenant } = useTenantContext();
  const { user, role, logout } = useAuth();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { t } = useTranslation('navigation');
  const { t: tCommon } = useTranslation('common');
  const isDark = colorScheme === 'dark';

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    navigation.sections.reduce((acc, s) => ({ ...acc, [s.id]: true }), {})
  );

  const toggleSection = (id: string) =>
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const isItemActive = (to?: string) => {
    if (!to) return false;
    return location.pathname.replace(/\/+$/, '') === to.replace(/\/+$/, '');
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
      navigate('/login');
    }
  };

  const brandName = tenant?.name ?? title;
  const brandInitial = brandName.charAt(0).toUpperCase();
  const userInitial = user?.email?.charAt(0).toUpperCase() ?? 'U';
  const roleDisplay = role?.replace(/_/g, ' ') ?? '';

  /* ── Collapsed: icon rail ────────────────────────── */
  if (collapsed) {
    const allSectionItems = navigation.sections.flatMap((s) => s.items);

    return (
      <Stack h="100%" gap={0} align="center" style={{ overflow: 'hidden' }}>
        {/* 60px brand zone — matches header height exactly */}
        <Group
          justify="center"
          align="center"
          gap={6}
          style={{ height: 60, flexShrink: 0, width: '100%' }}
        >
          <Tooltip label={brandName} position="right" withArrow>
            <Avatar size={28} radius="md" color="brand" style={{ cursor: 'default' }}>
              {brandInitial}
            </Avatar>
          </Tooltip>
          <Tooltip label={t('expandSidebar')} position="right" withArrow>
            <ActionIcon
              onClick={onToggle}
              variant="subtle"
              color="gray"
              size="xs"
              aria-label={t('expandSidebar')}
            >
              <IconLayoutSidebarLeftExpand size={14} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Divider w="100%" mb="sm" />

        {/* Nav icons */}
        <Stack gap={4} align="center" style={{ flex: 1 }}>
          {allSectionItems.map((item) => {
            const Icon = NAV_ICONS[item.id];
            const active = isItemActive(item.to);
            const label = t(item.id, { defaultValue: item.label });
            return (
              <Tooltip key={item.id} label={label} position="right" withArrow>
                <ActionIcon
                  component={Link}
                  to={item.to ?? '#'}
                  variant={active ? 'filled' : 'subtle'}
                  color={active ? 'brand' : 'gray'}
                  size="lg"
                  radius="md"
                  aria-label={label}
                >
                  {Icon && <Icon size={18} />}
                </ActionIcon>
              </Tooltip>
            );
          })}
        </Stack>

        {/* Bottom: dark mode, user, logout */}
        <Stack gap={6} align="center">
          <Tooltip
            label={isDark ? tCommon('theme.lightMode') : tCommon('theme.darkMode')}
            position="right"
            withArrow
          >
            <ActionIcon
              onClick={toggleColorScheme}
              variant="subtle"
              color="gray"
              size="lg"
              radius="md"
              aria-label="Toggle dark mode"
            >
              {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
          </Tooltip>

          <Divider w={40} />

          <Tooltip label={user?.email ?? 'Account'} position="right" withArrow>
            <Avatar size={32} radius="xl" color="brand" style={{ cursor: 'default' }}>
              {userInitial}
            </Avatar>
          </Tooltip>

          <Tooltip label={t('logout')} position="right" withArrow>
            <ActionIcon
              onClick={handleLogout}
              variant="subtle"
              color="red"
              size="lg"
              radius="md"
              aria-label={t('logout')}
            >
              <IconLogout size={18} />
            </ActionIcon>
          </Tooltip>
        </Stack>
      </Stack>
    );
  }

  /* ── Expanded: full sidebar ──────────────────────── */
  return (
    <Stack h="100%" gap={0} style={{ overflow: 'hidden' }}>
      {/* 60px brand zone — matches header height exactly */}
      <Box
        px="md"
        style={{
          height: 60,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Group justify="space-between" wrap="nowrap" gap="xs" style={{ width: '100%' }}>
          <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
            <Avatar size={32} radius="md" color="brand" style={{ flexShrink: 0 }}>
              {brandInitial}
            </Avatar>
            <Text size="sm" fw={700} truncate>
              {brandName}
            </Text>
          </Group>
          <Tooltip label={t('collapseSidebar')} position="right" withArrow>
            <ActionIcon
              onClick={onToggle}
              variant="subtle"
              color="gray"
              size="sm"
              aria-label={t('collapseSidebar')}
              style={{ flexShrink: 0 }}
            >
              <IconLayoutSidebarLeftCollapse size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Box>

      <Divider />

      {/* Navigation */}
      <ScrollArea style={{ flex: 1 }} scrollbarSize={4}>
        <Stack gap={0} px="sm" py="sm">
          {navigation.sections.map((section) => (
            <SidebarSection
              key={section.id}
              section={section}
              isExpanded={expandedSections[section.id] ?? true}
              onToggle={() => toggleSection(section.id)}
              isItemActive={isItemActive}
              onNavigate={onNavigate}
              extraContent={
                section.id === 'system' ? (
                  <DarkModeToggleItem isDark={isDark} onToggle={toggleColorScheme} />
                ) : undefined
              }
            />
          ))}
        </Stack>
      </ScrollArea>

      <Divider />

      {/* User profile */}
      <Box px="md" py="sm" style={{ flexShrink: 0 }}>
        <Group gap="sm" wrap="nowrap">
          <Avatar size={32} radius="xl" color="brand" style={{ flexShrink: 0 }}>
            {userInitial}
          </Avatar>
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Text size="xs" fw={600} truncate>
              {user?.email ?? 'User'}
            </Text>
            <Text size="xs" c="dimmed" truncate tt="capitalize">
              {roleDisplay}
            </Text>
          </Box>
        </Group>
      </Box>

      {/* Logout */}
      <Box px="sm" pb="sm" style={{ flexShrink: 0 }}>
        <NavLink
          label={t('logout')}
          leftSection={<IconLogout size={16} stroke={1.5} />}
          onClick={handleLogout}
          component="button"
          styles={(theme) => ({
            root: {
              borderRadius: theme.radius.md,
              padding: '8px 10px',
              color: theme.colors.red[6],
              width: '100%',
              '&:hover': {
                backgroundColor: theme.colors.red[0],
              },
            },
            label: {
              fontSize: theme.fontSizes.sm,
              fontWeight: 500,
            },
          })}
        />
      </Box>
    </Stack>
  );
}

/* ─── DarkModeToggleItem ──────────────────────────── */

interface DarkModeToggleItemProps {
  isDark: boolean;
  onToggle: () => void;
}

function DarkModeToggleItem({ isDark, onToggle }: DarkModeToggleItemProps) {
  const { t } = useTranslation('common');

  return (
    <Group
      justify="space-between"
      align="center"
      px={10}
      py={8}
      style={{ borderRadius: 8, cursor: 'default' }}
    >
      <Group gap={10} wrap="nowrap">
        <Box
          style={{
            width: 16,
            height: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {isDark ? <IconSun size={16} stroke={1.5} /> : <IconMoon size={16} stroke={1.5} />}
        </Box>
        <Text size="sm">{t('theme.darkMode')}</Text>
      </Group>
      <Switch
        size="xs"
        checked={isDark}
        onChange={onToggle}
        aria-label={t('theme.darkMode')}
        onClick={(e) => e.stopPropagation()}
      />
    </Group>
  );
}

/* ─── SidebarSection ──────────────────────────────── */

interface SidebarSectionProps {
  section: NavigationGroup;
  isExpanded: boolean;
  onToggle: () => void;
  isItemActive: (to?: string) => boolean;
  onNavigate?: () => void;
  extraContent?: React.ReactNode;
}

function SidebarSection({
  section,
  isExpanded,
  onToggle,
  isItemActive,
  onNavigate,
  extraContent,
}: SidebarSectionProps) {
  const { t } = useTranslation('navigation');
  const sectionLabel = t(`sections.${section.id}`, { defaultValue: section.label });

  return (
    <Box mb="xs">
      {section.label && (
        <UnstyledButton onClick={onToggle} w="100%" mb={4}>
          <Group justify="space-between" align="center" px={4} py={2} wrap="nowrap">
            <Text size="xs" fw={600} c="dimmed" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
              {sectionLabel}
            </Text>
            <IconChevronDown
              size={12}
              style={{
                color: 'var(--mantine-color-dimmed)',
                transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 150ms ease',
                flexShrink: 0,
              }}
            />
          </Group>
        </UnstyledButton>
      )}

      {isExpanded && (
        <Stack gap={2}>
          {section.items.map((item) => (
            <FullNavItem
              key={item.id}
              item={item}
              isActive={isItemActive(item.to)}
              onNavigate={onNavigate}
            />
          ))}
          {extraContent}
        </Stack>
      )}
    </Box>
  );
}

/* ─── FullNavItem ─────────────────────────────────── */

interface FullNavItemProps {
  item: NavigationItem;
  isActive: boolean;
  onNavigate?: () => void;
}

function FullNavItem({ item, isActive, onNavigate }: FullNavItemProps) {
  const { t } = useTranslation('navigation');
  const Icon = NAV_ICONS[item.id];
  const label = t(item.id, { defaultValue: item.label });

  return (
    <NavLink
      label={label}
      leftSection={Icon ? <Icon size={16} stroke={1.5} /> : undefined}
      component={Link}
      to={item.to ?? '#'}
      onClick={onNavigate}
      active={isActive}
      title={label}
      styles={(theme) => ({
        root: {
          borderRadius: theme.radius.md,
          padding: '8px 10px',
          fontWeight: isActive ? 600 : 400,
          '&[data-active]': {
            backgroundColor: theme.colors.brand[0],
            color: theme.colors.brand[7],
          },
          '&[data-active]:hover': {
            backgroundColor: theme.colors.brand[1],
          },
          '&:hover:not([data-active])': {
            backgroundColor: 'var(--mantine-color-default-hover)',
          },
        },
        label: {
          fontSize: theme.fontSizes.sm,
        },
      })}
    />
  );
}

export type { NavigationGroup } from '@modules/platform/config/navigationTypes';
