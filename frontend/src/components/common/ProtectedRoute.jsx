
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ requiredRole }) {
  const { isLoggedIn, user } = useAuth();

  // Not logged in → send to login page
  if (!isLoggedIn) return <Navigate to='/login' replace />;

  // Logged in but wrong role → send to home
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to='/' replace />;
  }

  // OK — render the child route
  return <Outlet />;
}