import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from '@app/routing/PrivateRoute';
import GlobalErrorBoundary from '@core/errorBoundary/GlobalErrorBoundary';
import LoginPage from '@modules/auth/pages/LoginPage';
import DashboardPage from '@modules/platform/pages/DashboardPage';
import OrdersPage from '@modules/platform/pages/OrdersPage';
import CustomersPage from '@modules/platform/pages/CustomersPage';
import UsersPage from '@modules/platform/pages/UsersPage';
import SettingsPage from '@modules/platform/pages/SettingsPage';

function App() {
  return (
    <GlobalErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={['super_admin', 'org_admin', 'user']}>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute allowedRoles={['super_admin', 'org_admin', 'user']}>
                <OrdersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute allowedRoles={['super_admin', 'org_admin']}>
                <CustomersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute allowedRoles={['super_admin']}>
                <UsersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute allowedRoles={['super_admin', 'org_admin', 'user']}>
                <SettingsPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </GlobalErrorBoundary>
  );
}

export default App;
