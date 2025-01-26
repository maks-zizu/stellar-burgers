import ingredientsSlice, {
  fetchIngredients
} from '../services/ingredientsSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import { IngredientsState } from '../services/ingredientsSlice'; // импорт интерфейса состояния

describe('ingredientsSlice', () => {
  const initialState: IngredientsState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  it('должен вернуть начальное состояние', () => {
    // Важно: для слайса передаем правильное состояние
    expect(ingredientsSlice(initialState, {} as PayloadAction)).toEqual(
      initialState
    );
  });

  it('должен обновлять ingredients при успешном запросе', () => {
    const ingredients = [
      { _id: '1', name: 'ingredient1', type: 'bun', price: 10, image: '' }
    ];
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: ingredients
    };

    // Для проверки используем редьюсер с правильными параметрами
    expect(ingredientsSlice(initialState, action)).toEqual({
      ingredients,
      isLoading: false,
      error: null
    });
  });

  it('должен обновлять состояние при ошибке в запросе', () => {
    const action = { type: fetchIngredients.rejected.type, payload: 'Error' };

    expect(ingredientsSlice(initialState, action)).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Error'
    });
  });
});
