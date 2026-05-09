import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Alert, PasswordInput, Stack } from '@mantine/core';
import { useAuth } from '@core/auth/useAuth';
import AuthLayout from '@platform-ui/layouts/AuthLayout';
import Button from '@platform-ui/primitives/Button';
import FormField from '@platform-ui/primitives/FormField';
import Input from '@platform-ui/primitives/Input';
import { toast } from '@core/toast/toast';

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
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });

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
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap="md">
          <Controller
            name="email"
            control={control}
            rules={{ required: t('login.errors.emailRequired') }}
            render={({ field }) => (
              <FormField label={t('login.email')} error={errors.email?.message} required>
                <Input {...field} type="email" autoComplete="email" />
              </FormField>
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: t('login.errors.passwordRequired') }}
            render={({ field }) => (
              <FormField label={t('login.password')} error={errors.password?.message} required>
                <PasswordInput {...field} autoComplete="current-password" />
              </FormField>
            )}
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
      </form>
    </AuthLayout>
  );
}
