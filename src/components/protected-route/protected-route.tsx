import React, { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../../services/store';
import { Preloader } from '@ui';

type TProtectedRouteProps = {
  children: ReactElement;
  anonymous?: boolean;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  children,
  anonymous = false
}) => {
  const location = useLocation();
  const { isAuthenticated, isAuthChecked } = useSelector(
    (state: RootState) => state.user
  );
  console.log('🚀 ~ isAuthChecked:', isAuthChecked);

  // // Если проверка авторизации еще не завершена, показываем индикатор загрузки
  // if (!isAuthChecked) {
  //   return <Preloader />;
  // }

  // Если пользователь авторизован и маршрут анонимный, редиректим на предыдущую страницу или "/"
  if (isAuthenticated && anonymous) {
    const from = (location.state as { from?: string })?.from || '/';
    return <Navigate to={from} />;
  }

  // Если пользователь не авторизован и маршрут защищен, редиректим на логин
  if (!isAuthenticated && !anonymous) {
    return <Navigate to='/login' replace state={{ from: location.pathname }} />;
  }

  // Рендерим детей, если все условия выполнены
  return children;
};
