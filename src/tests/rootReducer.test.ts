import store, { rootReducer } from '../services/store';
import { RootState } from '../services/store';

describe('rootReducer', () => {
  it('должен инициализировать состояние корректно', () => {
    const state: RootState = store.getState();

    // Проверяем начальное состояние каждого слайса
    expect(state.user).toEqual({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      isAuthChecked: false,
      error: null
    }); // Проверка состояния user

    expect(state.ingredients).toEqual({
      error: null,
      isLoading: false,
      ingredients: []
    }); // Начальное состояние ingredients

    expect(state.burgerConstructor).toEqual({
      constructorItems: { bun: null, ingredients: [] },
      orderRequest: false,
      orderModalData: null
    }); // Начальное состояние burgerConstructor

    expect(state.orders).toEqual({ orders: [], isLoading: false, error: null }); // Начальное состояние orders

    expect(state.feeds).toEqual({
      // Здесь должны быть начальные данные для feeds, так как это объект
      feeds: {
        orders: [],
        total: 0,
        totalToday: 0,
        success: false
      },
      isLoading: false,
      error: null
    }); // Начальное состояние feeds
  });
});
