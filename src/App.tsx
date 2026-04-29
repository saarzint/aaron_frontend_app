import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from '@app/routing/PrivateRoute';
import LoginPage from '@modules/ecommerce/pages/LoginPage';
import AdminDashboard from '@modules/ecommerce/pages/AdminDashboard';
import OrgDashboard from '@modules/ecommerce/pages/OrgDashboard';
import UserDashboard from '@modules/ecommerce/pages/UserDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/org"
          element={
            <PrivateRoute>
              <OrgDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/user"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
