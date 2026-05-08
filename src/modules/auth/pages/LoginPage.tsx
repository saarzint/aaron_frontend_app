import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Alert, PasswordInput, Stack } from '@mantine/core';
import { useAuth } from '@core/auth/useAuth';
import AuthLayout from '@platform-ui/layouts/AuthLayout';
import Button from '@platform-ui/primitives/Button';
import FormField from '@platform-ui/primitives/FormField';
import Input from '@platform-ui/primitives/Input';

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
      navigate(ROLE_ROUTES[role] ?? '/dashboard');
    } catch (err) {
      const message = (err as { message?: string })?.message ?? 'Login failed';
      setError('root', { message });
    }
  };

  return (
    <AuthLayout title="Sign in" subtitle="Access your workspace">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap="md">
          <Controller
            name="email"
            control={control}
            rules={{ required: 'Email is required' }}
            render={({ field }) => (
              <FormField label="Email" error={errors.email?.message} required>
                <Input {...field} type="email" autoComplete="email" />
              </FormField>
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: 'Password is required' }}
            render={({ field }) => (
              <FormField label="Password" error={errors.password?.message} required>
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
            Sign in
          </Button>
        </Stack>
      </form>
    </AuthLayout>
  );
}
