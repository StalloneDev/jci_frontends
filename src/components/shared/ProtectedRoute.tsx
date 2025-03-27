import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  console.log('ProtectedRoute:', { user, isLoading }); // Debug log

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
