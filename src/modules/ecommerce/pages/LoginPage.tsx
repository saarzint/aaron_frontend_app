import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@core/auth/useAuth';

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
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const { role } = await loginUser(data);
      navigate(ROLE_ROUTES[role] ?? '/dashboard/user');
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message ?? 'Login failed';
      setError('root', { message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Login</h1>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email', { required: 'Email is required' })} />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      {errors.root && <span>{errors.root.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
