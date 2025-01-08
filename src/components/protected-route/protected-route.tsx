import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../../services/store';

type TProtectedRouteProps = {
  children: JSX.Element;
  anonymous?: boolean;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  children,
  anonymous = false
}) => {
  const location = useLocation();
  const token = localStorage.getItem('refreshToken');
  const { isAuthenticated, user, isLoading } = useSelector(
    (state: RootState) => state.user
  );

  if (isLoading || (!user && token)) return null;

  if (isAuthenticated && anonymous) {
    const from = (location.state as { from?: string })?.from || '/';
    return <Navigate to={from} />;
  }

  if (!isAuthenticated && !anonymous) {
    return <Navigate to='/login' replace state={{ from: location.pathname }} />;
  }

  return children;
};
