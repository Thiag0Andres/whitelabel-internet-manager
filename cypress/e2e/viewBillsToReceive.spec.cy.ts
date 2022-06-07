describe('Bills to receive', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');

    cy.get('#email').type('admin@provider.com');
    cy.get('#password').type('a1b2c3d4e5');
    cy.get('#button-login').click();

    cy.wait(2000);
    cy.get('#contas-a-receber').click();
  });

  it('Should display the bills to receive screen', () => {
    cy.url().should('include', 'http://localhost:3000/home/bills-to-receive');
  });

  it('Should search for a existing bill by due date', () => {
    cy.get('#input-search').type('5/10/2021');
    cy.get('#input-search').should('have.value', '5/10/2021');

    cy.get('#bills-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing bill by name', () => {
    cy.get('#input-search').type('Testando Cliente');
    cy.get('#input-search').should('have.value', 'Testando Cliente');

    cy.get('#bills-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing bill by value', () => {
    cy.get('#input-search').type('150,00');
    cy.get('#input-search').should('have.value', '150,00');

    cy.get('#bills-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing bill by payment', () => {
    cy.get('#input-search').type('05/09/2021');
    cy.get('#input-search').should('have.value', '05/09/2021');

    cy.get('#bills-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing bill by note number', () => {
    cy.get('#input-search').type(
      '36490.00050 00030.530406 00000.000125 2 88100000140000',
    );
    cy.get('#input-search').should(
      'have.value',
      '36490.00050 00030.530406 00000.000125 2 88100000140000',
    );

    cy.get('#bills-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a inexistent bill', () => {
    cy.get('#input-search').type('Inexistente');
    cy.get('#input-search').should('have.value', 'Inexistente');

    cy.get('#bills-list tr').should('have.length.lessThan', 1);
  });

  it('Should open the modal filter', () => {
    cy.get('#button-filter').click();

    cy.get('#modal-filter').should('be.visible');

    cy.wait(2000);

    cy.get('#button-close-filter').click();
  });

  it('Should filter bill', () => {
    cy.get('#button-filter').click();

    cy.get('#modal-filter').should('be.visible');

    cy.wait(1000);
    cy.get('#check1').type('true');

    cy.get('#check2').type('true');

    cy.get('#button-filter-request').click();
  });

  it('Should reset filters for bills', () => {
    cy.get('#input-search').type('Inexistente');
    cy.get('#input-search').should('have.value', 'Inexistente');

    cy.get('#bills-list tr').should('have.length.lessThan', 1);
    cy.get('#clear-filters').click();
    cy.get('#bills-list tr').should('have.length.greaterThan', 0);
  });
});
