import feedsSlice, { fetchFeeds, initialState } from '../services/feedsSlice';
import { PayloadAction } from '@reduxjs/toolkit';

describe('feedsSlice', () => {
  it('должен вернуть начальное состояние', () => {
    expect(feedsSlice(undefined, {} as PayloadAction)).toEqual(initialState);
  });

  it('должен обновлять feeds при успешном запросе', () => {
    const feeds = {
      orders: [{ _id: '1', status: 'done', name: 'order1' }],
      total: 1,
      totalToday: 1,
      success: true
    };
    const action = { type: fetchFeeds.fulfilled.type, payload: feeds };

    expect(feedsSlice(initialState, action)).toEqual({
      feeds,
      isLoading: false,
      error: null
    });
  });

  it('должен обновлять состояние при ошибке в запросе', () => {
    const action = { type: fetchFeeds.rejected.type, payload: 'Error' };

    expect(feedsSlice(initialState, action)).toEqual({
      feeds: {
        orders: [],
        total: 0,
        totalToday: 0,
        success: false
      },
      isLoading: false,
      error: 'Error'
    });
  });
});
