import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = () => {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute; 