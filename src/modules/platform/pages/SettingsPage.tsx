import { useEffect, useMemo } from 'react';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { Divider, Group, Select, Stack, Switch, Text } from '@mantine/core';
import { useAuth } from '@core/auth/useAuth';
import { ROLE_CONFIG, isAppRole } from '../config/moduleRegistry';
import { mockSettingRows } from '@mocks/data';
import AppShell from '@platform-ui/components/AppShell/AppShell';
import Card from '@platform-ui/primitives/Card';
import { SUPPORTED_LOCALES, LOCALE_LABELS } from '@core/i18n/index';
import { toast } from '@core/toast/toast';
import {
  useAppForm,
  Form,
  FormSection,
  FormActions,
  ControlledTextInput,
  emailField,
} from '@platform-ui/forms';

interface ProfileForm {
  displayName: string;
  email: string;
}

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

  const profileSchema = useMemo(
    () =>
      z.object({
        displayName: z.string().min(1, t('profile.errors.nameRequired')),
        email: emailField(t('profile.errors.emailRequired'), t('profile.errors.emailInvalid')),
      }),
    [t]
  );

  const profileForm = useAppForm<ProfileForm>({
    schema: profileSchema,
    defaultValues: { displayName: 'Admin User', email: 'admin@example.com' },
  });

  const isDirty = profileForm.formState.isDirty;

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!isDirty) return;
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as Element | null;
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== '_self') return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      const nextUrl = new URL(anchor.href, window.location.origin);
      if (nextUrl.origin !== window.location.origin) return;
      if (
        nextUrl.pathname === window.location.pathname &&
        nextUrl.search === window.location.search
      )
        return;

      const confirmLeave = window.confirm('You have unsaved changes. Discard them?');
      if (!confirmLeave) {
        event.preventDefault();
      }
    };

    document.addEventListener('click', onDocumentClick, true);
    return () => document.removeEventListener('click', onDocumentClick, true);
  }, [isDirty]);

  const onProfileSubmit = async (data: ProfileForm) => {
    await new Promise<void>((r) => setTimeout(r, 500));
    toast.success({ message: t('profile.saved') });
    profileForm.reset(data);
  };

  if (!config) return <Navigate to="/login" replace />;

  return (
    <AppShell title={config.title} pageTitle={tNav('settings')} navigation={config.navigation}>
      <Stack gap="md">
        {/* Profile form */}
        <Card
          p="lg"
          style={{
            border: '1px solid var(--mantine-color-default-border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <Form form={profileForm} onSubmit={onProfileSubmit}>
            <FormSection title={t('profile.title')} description={t('profile.description')}>
              <Stack gap="sm" mt="xs">
                <ControlledTextInput
                  name="displayName"
                  control={profileForm.control}
                  label={t('profile.displayName')}
                  required
                />
                <ControlledTextInput
                  name="email"
                  control={profileForm.control}
                  label={t('profile.email')}
                  type="email"
                  required
                />
              </Stack>
            </FormSection>
            <FormActions
              isDirty={isDirty}
              isSubmitting={profileForm.formState.isSubmitting}
              onReset={() => profileForm.reset()}
            />
          </Form>
        </Card>

        {/* Preferences */}
        <Card
          p="lg"
          style={{
            border: '1px solid var(--mantine-color-default-border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <Stack gap="lg">
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
