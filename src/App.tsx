import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from '@app/routing/PrivateRoute';
import LoginPage from '@modules/auth/pages/LoginPage';
import RoleDashboard from '@modules/platform/pages/RoleDashboard';

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
          path="/dashboard/org"
          element={
            <PrivateRoute allowedRoles={['super_admin', 'org_admin']}>
              <RoleDashboard />
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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
