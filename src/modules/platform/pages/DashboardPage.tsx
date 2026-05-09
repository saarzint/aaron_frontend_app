import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, Grid, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { BarChart, DonutChart } from '@mantine/charts';
import { Navigate } from 'react-router-dom';
import {
  IconShoppingCart,
  IconUsers,
  IconCurrencyDollar,
  IconArrowBack,
  IconTrendingUp,
  IconTrendingDown,
} from '@tabler/icons-react';
import AppShell from '@platform-ui/components/AppShell/AppShell';
import Card from '@platform-ui/primitives/Card';
import { getOrders } from '@core/api/services/orderService';
import { useAuth } from '@core/auth/useAuth';
import { useTenantQueryKeys } from '@config/queryConfig';
import { useFormatters } from '@core/formatting/useFormatters';
import FeatureFlag from '@core/featureFlags/FeatureFlag';
import { useToast } from '@core/toast/useToast';
import {
  mockCustomers,
  mockProductSales,
  mockCategorySales,
  mockCountrySales,
  mockCountryDotColors,
} from '@mocks/data';
import { ROLE_CONFIG, isAppRole } from '../config/moduleRegistry';
import { DASHBOARD_WIDGETS } from '../config/dashboardConfig';

/* ── StatCard ─────────────────────────────────────────────── */

interface StatCardProps {
  label: string;
  value: string | number;
  trend: string;
  positive: boolean;
  icon: React.ComponentType<{ size?: number; stroke?: number }>;
  iconBg: string;
  iconColor: string;
}

function StatCard({ label, value, trend, positive, icon: Icon, iconBg, iconColor }: StatCardProps) {
  const { t } = useTranslation('common');
  const TrendIcon = positive ? IconTrendingUp : IconTrendingDown;
  const trendColor = positive ? 'var(--mantine-color-success-6)' : 'var(--mantine-color-danger-6)';

  return (
    <Card
      p="lg"
      style={{
        border: '1px solid var(--mantine-color-default-border)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      <Stack gap={10}>
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Text size="xs" c="dimmed" fw={500} tt="uppercase" style={{ letterSpacing: '0.03em' }}>
            {label}
          </Text>
          <Box
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              backgroundColor: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Box style={{ color: iconColor, display: 'flex' }}>
              <Icon size={17} stroke={1.5} />
            </Box>
          </Box>
        </Group>

        <Text fw={700} style={{ fontSize: 26, lineHeight: 1 }}>
          {value}
        </Text>

        <Group gap={4} wrap="nowrap">
          <Box style={{ color: trendColor, flexShrink: 0, display: 'flex' }}>
            <TrendIcon size={13} />
          </Box>
          <Text size="xs" fw={600} style={{ color: trendColor }}>
            {trend}
          </Text>
          <Text size="xs" c="dimmed">
            {t('labels.vsPeriod')}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}

/* ── CategoryLegend ───────────────────────────────────────── */

function CategoryLegend() {
  const half = Math.ceil(mockCategorySales.length / 2);
  const col1 = mockCategorySales.slice(0, half);
  const col2 = mockCategorySales.slice(half);

  const dotStyle = (color: string) => {
    const [palette, shade] = color.split('.');
    return `var(--mantine-color-${palette}-${shade})`;
  };

  return (
    <Group gap="xl" align="flex-start" wrap="nowrap">
      {[col1, col2].map((col, ci) => (
        <Stack key={ci} gap={8}>
          {col.map((item) => (
            <Group key={item.name} gap={8} wrap="nowrap">
              <Box
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  backgroundColor: dotStyle(item.color),
                  flexShrink: 0,
                }}
              />
              <Text size="xs" c="dimmed">
                {item.name} –{' '}
                <Text span size="xs" fw={600} c="default">
                  {item.value}%
                </Text>
              </Text>
            </Group>
          ))}
        </Stack>
      ))}
    </Group>
  );
}

/* ── DashboardPage ────────────────────────────────────────── */

export default function DashboardPage() {
  const { role } = useAuth();
  const { t } = useTranslation('dashboard');
  const { t: tNav } = useTranslation('navigation');
  const tenantQueryKeys = useTenantQueryKeys();
  const fmt = useFormatters();
  const config = useMemo(() => (isAppRole(role) ? ROLE_CONFIG[role] : null), [role]);
  const { success: toastSuccess } = useToast();

  const ordersQuery = useQuery({
    queryKey: tenantQueryKeys.orders(),
    queryFn: getOrders,
  });

  if (!config) return <Navigate to="/login" replace />;

  const widgets = isAppRole(role) ? DASHBOARD_WIDGETS[role] : DASHBOARD_WIDGETS.user;

  const orders = ordersQuery.data ?? [];
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;

  const customerStat: StatCardProps = {
    label: t('stats.totalCustomers'),
    value: fmt.number(mockCustomers.length),
    trend: '+2.5%',
    positive: true,
    icon: IconUsers,
    iconBg: 'var(--mantine-color-blue-0)',
    iconColor: 'var(--mantine-color-blue-6)',
  };

  const revenueStat: StatCardProps = {
    label: t('stats.totalRevenue'),
    value: fmt.currency(totalRevenue),
    trend: '+0.5%',
    positive: true,
    icon: IconCurrencyDollar,
    iconBg: 'var(--mantine-color-teal-0)',
    iconColor: 'var(--mantine-color-teal-6)',
  };

  const ordersStat: StatCardProps = {
    label: t('stats.totalOrders'),
    value: fmt.number(orders.length),
    trend: '-0.2%',
    positive: false,
    icon: IconShoppingCart,
    iconBg: 'var(--mantine-color-orange-0)',
    iconColor: 'var(--mantine-color-orange-6)',
  };

  const returnsStat: StatCardProps = {
    label: t('stats.totalReturns'),
    value: fmt.number(pendingCount),
    trend: pendingCount <= completedCount ? '+0.12%' : '-0.12%',
    positive: pendingCount <= completedCount,
    icon: IconArrowBack,
    iconBg: 'var(--mantine-color-red-0)',
    iconColor: 'var(--mantine-color-red-6)',
  };

  const stats: StatCardProps[] = [
    ...(widgets.customerStats ? [customerStat] : []),
    ...(widgets.revenueStats ? [revenueStat] : []),
    ...(widgets.ordersStats ? [ordersStat] : []),
    ...(widgets.returnsStats ? [returnsStat] : []),
  ];

  const cardStyle = {
    border: '1px solid var(--mantine-color-default-border)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  };

  const showBottomRow = widgets.categoryChart || widgets.countryChart;
  const bothBottomVisible = widgets.categoryChart && widgets.countryChart;

  return (
    <AppShell title={config.title} pageTitle={tNav('dashboard')} navigation={config.navigation}>
      <Stack gap="lg">
        {/* ── Header row with optional export ── */}
        <FeatureFlag flag="exportData">
          <Group justify="flex-end">
            <Button
              size="xs"
              variant="light"
              leftSection={<IconDownload size={14} />}
              onClick={() => toastSuccess('Export started', t('charts.productSales'))}
            >
              {t('common:actions.export', 'Export')}
            </Button>
          </Group>
        </FeatureFlag>

        {/* ── Stat cards ── */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </SimpleGrid>

        {/* ── Product sales bar chart ── */}
        {widgets.productSalesChart && (
          <Card p="lg" style={cardStyle}>
            <Stack gap="md">
              <Text fw={600} size="md">
                {t('charts.productSales')}
              </Text>
              <BarChart
                h={260}
                data={mockProductSales}
                dataKey="date"
                series={[
                  { name: t('charts.grossMargin'), color: 'blue.5' },
                  { name: t('charts.revenue'), color: 'orange.4' },
                ]}
                tickLine="none"
                gridAxis="y"
                barProps={{ radius: [3, 3, 0, 0] }}
                withLegend
                legendProps={{ verticalAlign: 'top', align: 'right', height: 36 }}
                yAxisProps={{
                  tickFormatter: (v: number) => `${(v / 1000).toFixed(0)}K`,
                }}
                styles={{
                  root: { fontSize: 12 },
                }}
              />
            </Stack>
          </Card>
        )}

        {/* ── Bottom row: category + country charts ── */}
        {showBottomRow && (
          <Grid gap="md">
            {widgets.categoryChart && (
              <Grid.Col span={{ base: 12, md: bothBottomVisible ? 7 : 12 }}>
                <Card p="lg" style={{ ...cardStyle, height: '100%' }}>
                  <Stack gap="lg">
                    <Text fw={600} size="md">
                      {t('charts.salesByCategory')}
                    </Text>
                    <Group gap="xl" align="center" wrap="nowrap">
                      <Box style={{ flexShrink: 0 }}>
                        <DonutChart
                          data={mockCategorySales}
                          size={170}
                          thickness={28}
                          tooltipDataSource="segment"
                          withTooltip
                        />
                      </Box>
                      <CategoryLegend />
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
            )}

            {widgets.countryChart && (
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Card p="lg" style={{ ...cardStyle, height: '100%' }}>
                  <Stack gap="lg">
                    <Text fw={600} size="md">
                      {t('charts.salesByCountry')}
                    </Text>
                    <Stack gap={10}>
                      {mockCountrySales.map((item, idx) => (
                        <Group key={item.country} justify="space-between" wrap="nowrap">
                          <Group gap={10} wrap="nowrap">
                            <Box
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: mockCountryDotColors[idx],
                                flexShrink: 0,
                              }}
                            />
                            <Text size="sm">{item.country}</Text>
                          </Group>
                          <Text size="sm" fw={600}>
                            {item.value}%
                          </Text>
                        </Group>
                      ))}
                    </Stack>
                  </Stack>
                </Card>
              </Grid.Col>
            )}
          </Grid>
        )}
      </Stack>
    </AppShell>
  );
}
