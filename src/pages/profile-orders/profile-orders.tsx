import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import { fetchOrders } from '../../services/ordersSlice';
import { fetchFeeds } from '../../services/feedsSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((store) => store.orders);

  useEffect(() => {
    dispatch(fetchFeeds());
    dispatch(fetchOrders());
  }, [dispatch]);

  if (!orders.length && !isLoading) {
    return <div className='mt-10 text text_type_main-medium'>Заказов нет</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
