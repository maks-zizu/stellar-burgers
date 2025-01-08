import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  logoutApi,
  TRegisterData,
  TLoginData,
  updateUserApi
} from '../utils/burger-api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../utils/cookie';

// Типизация состояния пользователя
interface UserState {
  isAuthenticated: boolean;
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null
};

// Thunk для авторизации
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      const { accessToken, refreshToken, user } = response;
      setCookie('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk для регистрации
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      const { accessToken, refreshToken, user } = response;
      setCookie('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk для получения данных пользователя
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk для выхода из системы
export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Обновляем данные пользователя
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(data); // API вызов для обновления пользователя
      return response.user; // Возвращаем обновленные данные пользователя
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Слайс пользователя
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Логин
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.isAuthenticated = true; // ключевой момент
        state.user = action.payload;
      }
    );
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Регистрация
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      registerUser.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      }
    );
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Получение данных пользователя
    builder.addCase(fetchUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      fetchUser.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.isAuthenticated = true; // ключевой момент
        state.isLoading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.isLoading = false;
      // state.error = action.payload as string;
    });

    // Выход из системы
    builder.addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false; // отключили авторизацию
      state.user = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Обновляем данные пользователя
    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      updateUser.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  }
});

export default userSlice.reducer;
