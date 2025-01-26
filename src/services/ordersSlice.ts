import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../utils/burger-api';
import { TOrder } from '@utils-types';

interface OrdersState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

// Асинхронная функция для получения заказов
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default ordersSlice.reducer;
