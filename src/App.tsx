import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from '@app/routing/PrivateRoute';
import LoginPage from '@modules/auth/pages/LoginPage';
import CustomersPage from '@modules/platform/pages/CustomersPage';
import RoleDashboard from '@modules/platform/pages/RoleDashboard';
import SettingsPage from '@modules/platform/pages/SettingsPage';
import UsersPage from '@modules/platform/pages/UsersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute allowedRoles={['super_admin']}>
              <RoleDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/admin/customers"
          element={
            <PrivateRoute allowedRoles={['super_admin']}>
              <CustomersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/admin/users"
          element={
            <PrivateRoute allowedRoles={['super_admin']}>
              <UsersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/admin/settings"
          element={
            <PrivateRoute allowedRoles={['super_admin']}>
              <SettingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/org"
          element={
            <PrivateRoute allowedRoles={['super_admin', 'org_admin']}>
              <RoleDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/org/customers"
          element={
            <PrivateRoute allowedRoles={['super_admin', 'org_admin']}>
              <CustomersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/org/settings"
          element={
            <PrivateRoute allowedRoles={['super_admin', 'org_admin']}>
              <SettingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/user"
          element={
            <PrivateRoute allowedRoles={['super_admin', 'org_admin', 'user']}>
              <RoleDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/user/settings"
          element={
            <PrivateRoute allowedRoles={['super_admin', 'org_admin', 'user']}>
              <SettingsPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
