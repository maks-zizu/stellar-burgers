import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/feedsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { feeds, isLoading } = useSelector((store) => store.feeds);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isLoading || !feeds.orders.length) {
    return <Preloader />;
  }

  const handleGetFeeds = () => dispatch(fetchFeeds());

  return <FeedUI orders={feeds.orders} handleGetFeeds={handleGetFeeds} />;
};
