import constructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearOrderModal,
  initialState
} from '../services/constructorSlice';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';

describe('constructorSlice reducer', () => {
  it('должен обработать добавление булки (addBun)', () => {
    const bun: TIngredient = {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 30,
      calories: 200,
      price: 100,
      image: '',
      image_large: '',
      image_mobile: ''
    };

    const action = addBun(bun);
    const newState = constructorReducer(initialState, action);

    expect(newState.constructorItems.bun).toEqual(bun);
  });

  it('должен обработать добавление ингредиента (addIngredient)', () => {
    const ingredient: TIngredient = {
      _id: '2',
      name: 'Мясо',
      type: 'main',
      proteins: 20,
      fat: 10,
      carbohydrates: 50,
      calories: 300,
      price: 150,
      image: '',
      image_large: '',
      image_mobile: ''
    };

    const action = addIngredient(ingredient);
    const newState = constructorReducer(initialState, action);

    expect(newState.constructorItems.ingredients).toHaveLength(1);
    expect(newState.constructorItems.ingredients[0]).toHaveProperty('id');
    expect(newState.constructorItems.ingredients[0].name).toEqual(
      ingredient.name
    );
  });

  it('должен обработать удаление ингредиента (removeIngredient)', () => {
    const initialStateWithIngredients = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [
          {
            id: '1',
            _id: '2',
            name: 'Мясо',
            type: 'main',
            proteins: 20,
            fat: 10,
            carbohydrates: 50,
            calories: 300,
            price: 150,
            image: '',
            image_large: '',
            image_mobile: ''
          },
          {
            id: '2',
            _id: '3',
            name: 'Сыр',
            type: 'main',
            proteins: 15,
            fat: 7,
            carbohydrates: 25,
            calories: 200,
            price: 50,
            image: '',
            image_large: '',
            image_mobile: ''
          }
        ]
      }
    };

    const action = removeIngredient(1); // Удаляем второй ингредиент
    const newState = constructorReducer(initialStateWithIngredients, action);

    expect(newState.constructorItems.ingredients).toHaveLength(1);
    expect(newState.constructorItems.ingredients[0].name).toEqual('Мясо');
  });

  it('должен обработать изменение порядка ингредиентов (moveIngredient)', () => {
    const initialStateWithIngredients = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [
          {
            id: '1',
            _id: '2',
            name: 'Мясо',
            type: 'main',
            proteins: 20,
            fat: 10,
            carbohydrates: 50,
            calories: 300,
            price: 150,
            image: '',
            image_large: '',
            image_mobile: ''
          },
          {
            id: '2',
            _id: '3',
            name: 'Сыр',
            type: 'main',
            proteins: 15,
            fat: 7,
            carbohydrates: 25,
            calories: 200,
            price: 50,
            image: '',
            image_large: '',
            image_mobile: ''
          }
        ]
      }
    };

    const action = moveIngredient({ fromIndex: 0, toIndex: 1 }); // Меняем местами мясо и сыр
    const newState = constructorReducer(initialStateWithIngredients, action);

    expect(newState.constructorItems.ingredients[0].name).toEqual('Сыр');
    expect(newState.constructorItems.ingredients[1].name).toEqual('Мясо');
  });

  it('должен обработать очистку модального окна (clearOrderModal)', () => {
    const initialStateWithOrder = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: []
      },
      orderRequest: false,
      orderModalData: {
        _id: '1',
        status: 'done',
        name: 'Order #1',
        createdAt: '2022-01-01',
        updatedAt: '2022-01-02',
        number: 1,
        ingredients: ['2', '3']
      }
    };

    const action = clearOrderModal();
    const newState = constructorReducer(initialStateWithOrder, action);

    expect(newState.orderModalData).toBeNull();
  });
});
