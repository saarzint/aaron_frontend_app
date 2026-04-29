import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useAuth } from '@core/auth/useAuth';
import AuthLayout from '@platform-ui/layouts/AuthLayout';

interface LoginForm {
  email: string;
  password: string;
}

const ROLE_ROUTES: Record<string, string> = {
  super_admin: '/dashboard/admin',
  org_admin: '/dashboard/org',
  user: '/dashboard/user',
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
      navigate(ROLE_ROUTES[role] ?? '/dashboard/user');
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
              <TextInput
                {...field}
                label="Email"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: 'Password is required' }}
            render={({ field }) => (
              <PasswordInput
                {...field}
                label="Password"
                autoComplete="current-password"
                error={errors.password?.message}
              />
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
