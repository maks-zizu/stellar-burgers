import * as orderFixture from '../fixtures/order.json';

describe('Тестирование работы конструктора бургеров', () => {
  beforeEach(() => {
    // Перехватываем запросы на получение списка ингредиентов и подставляем фейковые данные
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });

    // Переходим на главную страницу
    cy.visit('/');

    // Сохраняем булку и другие ингредиенты в alias
    cy.get('[data-ingredient="bun"]').as('bun');
    cy.get('[data-ingredient="main"], [data-ingredient="sauce"]').as(
      'mainAndSauce'
    );
  });

  it('Ингредиенты доступны для выбора в конструкторе', () => {
    // Проверяем, что в конструкторе есть хотя бы одна булка
    cy.get('@bun').should('have.length.at.least', 1);

    // Проверяем, что в конструкторе есть хотя бы один основной ингредиент и соус
    cy.get('@mainAndSauce').should('have.length.at.least', 1);
  });

  describe('Тестирование модальных окон ингредиентов', () => {
    describe('Открытие модальных окон', () => {
      it('Открытие модального окна по клику на карточку ингредиента', () => {
        // Открытие модального окна при клике на первую булку
        cy.get('@bun').first().click();
        cy.get('#modals').children().should('have.length', 2);
      });

      it('Модальное окно остается открытым после перезагрузки страницы', () => {
        // Открываем модальное окно, перезагружаем страницу и проверяем его наличие
        cy.get('@bun').first().click();
        cy.reload(true);
        cy.get('#modals').children().should('have.length', 2);
      });
    });

    describe('Закрытие модальных окон', () => {
      it('Закрытие через крестик', () => {
        // Открываем модальное окно и закрываем его через кнопку крестика
        cy.get('@bun').first().click();
        cy.get('#modals button:first-of-type').click();
        cy.wait(500); // Ждем, чтобы модальное окно закрылось
        cy.get('#modals').children().should('have.length', 0);
      });

      it('Закрытие через клик по оверлею', () => {
        // Открываем модальное окно и закрываем его, кликнув по оверлею
        cy.get('@bun').first().click();
        cy.get('#modals>div:nth-of-type(2)').click({ force: true });
        cy.wait(500); // Ждем, чтобы модальное окно закрылось
        cy.get('#modals').children().should('have.length', 0);
      });

      it('Закрытие через клавишу Escape', () => {
        // Открываем модальное окно и закрываем его, нажав Escape
        cy.get('@bun').first().click();
        cy.get('body').type('{esc}');
        cy.wait(500); // Ждем, чтобы модальное окно закрылось
        cy.get('#modals').children().should('have.length', 0);
      });
    });
  });

  describe('Процесс оформления заказа', () => {
    beforeEach(() => {
      // Устанавливаем фейковые токены для авторизации в localStorage и cookies
      cy.setCookie('accessToken', 'test_access_token');
      localStorage.setItem('refreshToken', 'test_refresh_token');

      // Перехватываем запросы для проверки авторизации и создания заказа
      cy.intercept('GET', 'api/auth/user', { fixture: 'user' });
      cy.intercept('POST', 'api/orders', { fixture: 'order' }).as(
        'createOrder'
      );
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });

      // Переходим на главную страницу
      cy.visit('/');
    });

    it('Оформление заказа после авторизации', () => {
      // Выбираем первую булку
      cy.get('@bun').first().find('button').click();

      // Выбираем первый основной ингредиент
      cy.get('[data-ingredient="main"]:first-of-type button').click();

      // Проверяем, что кнопка оформления заказа стала активной
      cy.get('[data-order-button]').should('be.enabled');

      // Перехватываем запрос на создание заказа
      cy.get('[data-order-button]').click();

      // Ожидаем, что запрос на создание заказа был отправлен
      cy.wait('@createOrder').then((interception) => {
        // Сравниваем только ингредиенты по _id
        const requestIngredientsIds = interception.request.body.ingredients;
        const fixtureIngredientsIds = orderFixture.order.ingredients.map(
          (ingredient) => ingredient._id
        );
        expect(requestIngredientsIds).to.deep.equal(fixtureIngredientsIds);

        // Проверяем, что в новом модальном окне отображается номер заказа
        cy.get('#modals').children().should('have.length', 2);
        cy.get('#modals h2:first-of-type').should(
          'have.text',
          orderFixture.order.number
        );
      });
    });

    afterEach(() => {
      // Очистка фейковых токенов после завершения теста
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});
