import { useMemo } from 'react';
import { z } from 'zod';
import { Alert, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@core/auth/useAuth';
import { toast } from '@core/toast/toast';
import AuthLayout from '@platform-ui/layouts/AuthLayout';
import Button from '@platform-ui/primitives/Button';
import {
  useAppForm,
  Form,
  ControlledTextInput,
  ControlledPassword,
  emailField,
} from '@platform-ui/forms';

interface LoginForm {
  email: string;
  password: string;
}

const ROLE_ROUTES: Record<string, string> = {
  super_admin: '/dashboard',
  org_admin: '/dashboard',
  user: '/dashboard',
};

export default function LoginPage() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation('auth');

  const schema = useMemo(
    () =>
      z.object({
        email: emailField(
          t('login.errors.emailRequired'),
          t('login.errors.emailInvalid', 'Invalid email address')
        ),
        password: z.string().min(1, t('login.errors.passwordRequired')),
      }),
    [t]
  );

  const form = useAppForm<LoginForm>({
    schema,
    defaultValues: { email: '', password: '' },
  });

  const {
    formState: { errors, isSubmitting },
    setError,
  } = form;

  const onSubmit = async (data: LoginForm) => {
    try {
      const { role } = await loginUser(data);
      toast.success({ message: 'Welcome back!' });
      navigate(ROLE_ROUTES[role] ?? '/dashboard');
    } catch (err) {
      const message = (err as { message?: string })?.message ?? t('login.errors.loginFailed');
      setError('root', { message });
    }
  };

  return (
    <AuthLayout title={t('login.title')} subtitle={t('login.subtitle')}>
      <Form form={form} onSubmit={onSubmit}>
        <Stack gap="md">
          <ControlledTextInput
            name="email"
            control={form.control}
            label={t('login.email')}
            type="email"
            autoComplete="email"
            required
          />
          <ControlledPassword
            name="password"
            control={form.control}
            label={t('login.password')}
            autoComplete="current-password"
            required
          />
          {errors.root && (
            <Alert color="red" variant="light">
              {errors.root.message}
            </Alert>
          )}
          <Button type="submit" loading={isSubmitting} fullWidth>
            {t('login.submit')}
          </Button>
        </Stack>
      </Form>
    </AuthLayout>
  );
}
