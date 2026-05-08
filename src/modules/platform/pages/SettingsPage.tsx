import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { Divider, Group, Select, Stack, Switch, Text } from '@mantine/core';
import { useAuth } from '@core/auth/useAuth';
import { ROLE_CONFIG, isAppRole } from '../config/moduleRegistry';
import { mockSettingRows } from '@mocks/data';
import AppShell from '@platform-ui/components/AppShell/AppShell';
import Card from '@platform-ui/primitives/Card';
import { SUPPORTED_LOCALES, LOCALE_LABELS } from '@core/i18n/index';

export default function SettingsPage() {
  const { role } = useAuth();
  const { t } = useTranslation('settings');
  const { t: tNav } = useTranslation('navigation');
  const { i18n } = useTranslation();
  const config = useMemo(() => (isAppRole(role) ? ROLE_CONFIG[role] : null), [role]);

  const localeOptions = useMemo(
    () => SUPPORTED_LOCALES.map((lang) => ({ value: lang, label: LOCALE_LABELS[lang] })),
    []
  );

  if (!config) return <Navigate to="/login" replace />;

  return (
    <AppShell title={config.title} pageTitle={tNav('settings')} navigation={config.navigation}>
      <Stack gap="md">
        <Card
          p="lg"
          style={{
            border: '1px solid var(--mantine-color-default-border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <Stack gap="lg">
            {/* Language switcher */}
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="sm" fw={600}>
                  {t('language.label')}
                </Text>
                <Text size="xs" c="dimmed" mt={2}>
                  {t('language.description')}
                </Text>
              </div>
              <Select
                w={140}
                value={i18n.language}
                onChange={(val) => val && i18n.changeLanguage(val)}
                data={localeOptions}
                size="xs"
                aria-label={t('language.label')}
              />
            </Group>

            <Divider />

            {mockSettingRows.map((row) => (
              <Group key={row.title} justify="space-between" align="flex-start">
                <div>
                  <Text size="sm" fw={600}>
                    {row.title}
                  </Text>
                  <Text size="xs" c="dimmed" mt={2}>
                    {row.description}
                  </Text>
                </div>
                <Switch defaultChecked={row.enabled} aria-label={row.title} />
              </Group>
            ))}
          </Stack>
        </Card>
      </Stack>
    </AppShell>
  );
}
