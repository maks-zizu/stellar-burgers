import ordersSlice, {
  fetchOrders,
  initialState
} from '../services/ordersSlice';
import { PayloadAction } from '@reduxjs/toolkit';

describe('ordersSlice', () => {
  it('должен вернуть начальное состояние', () => {
    expect(ordersSlice(undefined, {} as PayloadAction)).toEqual(initialState);
  });

  it('должен обновлять список заказов при успешном запросе', () => {
    const orders = [{ _id: '1', status: 'done', name: 'order1' }];
    const action = { type: fetchOrders.fulfilled.type, payload: orders };

    expect(ordersSlice(initialState, action)).toEqual({
      orders,
      isLoading: false,
      error: null
    });
  });

  it('должен обновлять состояние при ошибке запроса', () => {
    const action = { type: fetchOrders.rejected.type, payload: 'Error' };

    expect(ordersSlice(initialState, action)).toEqual({
      orders: [],
      isLoading: false,
      error: 'Error'
    });
  });
});
