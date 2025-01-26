import userSlice, {
  loginUser,
  registerUser,
  fetchUser,
  logoutUser,
  initialState
} from '../services/userSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

describe('userSlice', () => {
  it('должен вернуть начальное состояние', () => {
    expect(userSlice(undefined, {} as PayloadAction)).toEqual(initialState);
  });

  it('должен обновлять состояние при успешной авторизации', () => {
    const user: TUser = { email: 'test@test.com', name: 'John Doe' };
    const action = { type: loginUser.fulfilled.type, payload: user };

    expect(userSlice(initialState, action)).toEqual({
      isAuthenticated: true,
      user,
      isLoading: false,
      isAuthChecked: true,
      error: null
    });
  });

  it('должен обновлять состояние при ошибке авторизации', () => {
    const action = { type: loginUser.rejected.type, payload: 'Error' };

    expect(userSlice(initialState, action)).toEqual({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      isAuthChecked: false,
      error: 'Error'
    });
  });

  it('должен обновлять состояние при успешной регистрации', () => {
    const user: TUser = { email: 'test@test.com', name: 'John Doe' };
    const action = { type: registerUser.fulfilled.type, payload: user };

    expect(userSlice(initialState, action)).toEqual({
      isAuthenticated: true,
      user,
      isLoading: false,
      isAuthChecked: false,
      error: null
    });
  });

  it('должен обновлять состояние при ошибке регистрации', () => {
    const action = { type: registerUser.rejected.type, payload: 'Error' };

    expect(userSlice(initialState, action)).toEqual({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      isAuthChecked: false,
      error: 'Error'
    });
  });

  it('должен обновлять состояние при успешной загрузке данных пользователя', () => {
    const user: TUser = { email: 'test@test.com', name: 'John Doe' };
    const action = { type: fetchUser.fulfilled.type, payload: user };

    expect(userSlice(initialState, action)).toEqual({
      isAuthenticated: true,
      user,
      isLoading: false,
      isAuthChecked: true,
      error: null
    });
  });

  it('должен обновлять состояние при ошибке загрузки данных пользователя', () => {
    const action = { type: fetchUser.rejected.type, payload: 'Error' };

    expect(userSlice(initialState, action)).toEqual({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      isAuthChecked: true, // Мы уже ставим флаг после попытки загрузки
      error: 'Error' // Ошибка теперь будет установлена
    });
  });

  it('должен обновлять состояние при выходе из системы', () => {
    const action = { type: logoutUser.fulfilled.type };

    expect(userSlice(initialState, action)).toEqual({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      isAuthChecked: true,
      error: null
    });
  });
});
