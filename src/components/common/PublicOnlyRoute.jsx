import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ROUTES } from '../../constants/routes';

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  if (!_hasHydrated) {
    return <div className="flex h-screen items-center justify-center bg-surface text-text-primary">Đang tải...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children ? children : <Outlet />;
};

export default PublicOnlyRoute;
