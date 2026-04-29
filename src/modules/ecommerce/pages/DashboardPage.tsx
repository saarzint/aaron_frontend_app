import { useNavigate } from 'react-router-dom';
import { useAuth } from '@core/auth/useAuth';
import DashboardLayout from '@platform-ui/layouts/DashboardLayout';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <DashboardLayout>
      <h1>Dashboard</h1>
      {user && <p>Welcome, {user.email}</p>}
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </DashboardLayout>
  );
}
