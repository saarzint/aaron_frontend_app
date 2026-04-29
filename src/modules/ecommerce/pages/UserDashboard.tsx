import { useNavigate } from 'react-router-dom';
import { useAuth } from '@core/auth/useAuth';
import DashboardLayout from '@platform-ui/layouts/DashboardLayout';

const modules = ['Orders'];

export default function UserDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <DashboardLayout>
      <h2>User Dashboard</h2>
      <p>Role: user</p>
      <ul>
        {modules.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </DashboardLayout>
  );
}
