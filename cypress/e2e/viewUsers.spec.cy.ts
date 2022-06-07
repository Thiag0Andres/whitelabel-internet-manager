describe('Users', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');

    cy.get('#email').type('admin@provider.com');
    cy.get('#password').type('a1b2c3d4e5');
    cy.get('#button-login').click();

    cy.wait(2000);
    cy.get('#clientes').click();
  });

  it('Should display the users screen', () => {
    cy.url().should('include', 'http://localhost:3000/home/clients');
  });

  it('Should search for a existing client by name', () => {
    cy.get('#input-search').type('José Victor');
    cy.get('#input-search').should('have.value', 'José Victor');

    cy.get('#users-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing client by CPF/CNPJ', () => {
    cy.get('#input-search').type('791.744.880-07');
    cy.get('#input-search').should('have.value', '791.744.880-07');

    cy.get('#users-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing client by plan', () => {
    cy.get('#input-search').type('10');
    cy.get('#input-search').should('have.value', '10');

    cy.get('#users-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a inexistent client', () => {
    cy.get('#input-search').type('Inexistente');
    cy.get('#input-search').should('have.value', 'Inexistente');

    cy.get('#users-list tr').should('have.length.lessThan', 1);
  });

  it('Should open the modal filter', () => {
    cy.get('#button-filter').click();

    cy.get('#modal-filter').should('be.visible');

    cy.wait(2000);

    cy.get('#button-close-filter').click();
  });

  it('Should filter client', () => {
    cy.get('#button-filter').click();

    cy.get('#modal-filter').should('be.visible');

    cy.wait(1000);
    cy.get('#check1').type('true');

    cy.get('#check2').type('true');

    cy.get('#button-filter-request').click();
  });

  it('Should reset filters for users', () => {
    cy.get('#input-search').type('Inexistente');
    cy.get('#input-search').should('have.value', 'Inexistente');

    cy.get('#users-list tr').should('have.length.lessThan', 1);
    cy.get('#clear-filters').click();
    cy.get('#users-list tr').should('have.length.greaterThan', 0);
  });
});
