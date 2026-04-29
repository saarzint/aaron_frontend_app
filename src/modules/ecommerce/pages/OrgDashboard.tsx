import { useNavigate } from 'react-router-dom';
import { useAuth } from '@core/auth/useAuth';
import DashboardLayout from '@platform-ui/layouts/DashboardLayout';

const modules = ['Orders', 'Customers'];

export default function OrgDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <DashboardLayout>
      <h2>Org Dashboard</h2>
      <p>Role: org_admin</p>
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
