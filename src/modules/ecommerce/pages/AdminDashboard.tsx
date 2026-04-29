import { useNavigate } from 'react-router-dom';
import { useAuth } from '@core/auth/useAuth';
import DashboardLayout from '@platform-ui/layouts/DashboardLayout';

const modules = ['Orders', 'Customers', 'Users', 'Settings'];

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <DashboardLayout>
      <h2>Admin Dashboard</h2>
      <p>Role: super_admin</p>
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
