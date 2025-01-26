import React, { useEffect } from 'react';
import styles from './app.module.css';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/ingredientsSlice';
import { Routes, Route, useLocation } from 'react-router-dom';
import {
  AppHeader,
  OrderInfo,
  IngredientDetails,
  ProtectedRoute,
  Modal
} from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { getCookie } from '../../utils/cookie';
import { fetchUser } from '../../services/userSlice';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const background = location.state && location.state.background;

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const { isAuthenticated, isLoading } = useSelector((state) => state.user);
  console.log('🚀🚀 ~ App ~ isAuthenticated:', isAuthenticated);
  console.log('🚀🚀 ~ App ~ isLoading:', isLoading);

  useEffect(() => {
    const token = getCookie('accessToken');
    console.log('🚀🚀 ~ useEffect ~ token:', token);
    if (token && !isAuthenticated) {
      dispatch(fetchUser())
        .unwrap()
        .catch((err) => {
          console.error('Ошибка при загрузке пользователя:', err);
        });
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute anonymous>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute anonymous>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute anonymous>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute anonymous>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                onClose={() => window.history.back()}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:id'
            element={
              <Modal
                title='Детали заказа'
                onClose={() => window.history.back()}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:id'
            element={
              <Modal
                title='Детали заказа'
                onClose={() => window.history.back()}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
