import { FC, useEffect } from 'react';
import { getCookie } from '../../utils/cookie';
import { fetchUser } from '../../services/userSlice';
import { useDispatch, useSelector } from '../../services/store';

type ProvideAuthProps = {
  children: JSX.Element;
};

export const ProviderAuth: FC<ProvideAuthProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.user);

  useEffect(() => {
    const token = getCookie('accessToken');
    if (token && !isAuthenticated) {
      dispatch(fetchUser())
        .unwrap()
        .catch((err) => {
          console.error('Ошибка при загрузке пользователя:', err);
        });
    }
  }, [dispatch, isAuthenticated]);

  return isLoading || !isAuthenticated ? null : children;
};
