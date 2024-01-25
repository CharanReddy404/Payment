import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../provider/authProvider';
import Header from '@/components/Header';

export const ProtectedRoute = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to='/signin' />;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
