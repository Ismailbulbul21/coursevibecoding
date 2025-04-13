import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute; 