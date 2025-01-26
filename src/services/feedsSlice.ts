import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../utils/burger-api';
import { TOrder } from '@utils-types';

interface TFeeds {
  orders: TOrder[];
  total: number;
  totalToday: number;
  success: boolean;
}

interface FeedsState {
  feeds: TFeeds;
  isLoading: boolean;
  error: string | null;
}

const initialState: FeedsState = {
  feeds: {
    orders: [],
    total: 0,
    totalToday: 0,
    success: false
  },
  isLoading: false,
  error: null
};

// Асинхронная функция для получения всех заказов
export const fetchFeeds = createAsyncThunk(
  'feeds/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feeds = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default feedsSlice.reducer;
