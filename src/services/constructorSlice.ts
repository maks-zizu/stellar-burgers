import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '../utils/burger-api';
import { RootState } from '../services/store';

interface IConstructorItems {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

interface IConstructorState {
  constructorItems: IConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

export const createOrder = createAsyncThunk(
  'constructor/createOrder',
  async (ingredientsIds: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientsIds);
      return response.order as TOrder;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState: IConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addBun(state, action: PayloadAction<TIngredient>) {
      state.constructorItems.bun = action.payload;
    },
    addIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        state.constructorItems.ingredients.push(action.payload);
      },
      prepare(ingredient: TIngredient) {
        return {
          payload: {
            ...ingredient,
            id: (Date.now() + Math.random()).toString()
          }
        };
      }
    },
    removeIngredient(state, action: PayloadAction<number>) {
      state.constructorItems.ingredients.splice(action.payload, 1);
    },
    moveIngredient(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      const [movedItem] = state.constructorItems.ingredients.splice(
        fromIndex,
        1
      );
      state.constructorItems.ingredients.splice(toIndex, 0, movedItem);
    },
    clearOrderModal(state) {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
        state.orderModalData = null;
      });
  }
});

export const {
  addBun,
  addIngredient,
  moveIngredient,
  removeIngredient,
  clearOrderModal
} = constructorSlice.actions;

export default constructorSlice.reducer;
