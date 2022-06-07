describe('Service plans', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');

    cy.get('#email').type('admin@provider.com');
    cy.get('#password').type('a1b2c3d4e5');
    cy.get('#button-login').click();

    cy.wait(2000);
    cy.get('#planos-de-serviço').click();
  });

  it('Should display the service plans screen', () => {
    cy.url().should('include', 'http://localhost:3000/home/service-plans');
  });

  it('Should search for a existing plan by name', () => {
    cy.get('#input-search').type('Plano 100 Mega');
    cy.get('#input-search').should('have.value', 'Plano 100 Mega');

    cy.get('#plans-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing plan by download', () => {
    cy.get('#input-search').type('50mb');
    cy.get('#input-search').should('have.value', '50mb');

    cy.get('#plans-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing plan by upload', () => {
    cy.get('#input-search').type('20mb');
    cy.get('#input-search').should('have.value', '20mb');

    cy.get('#plans-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing plan by value', () => {
    cy.get('#input-search').type('99,99');
    cy.get('#input-search').should('have.value', '99,99');

    cy.get('#plans-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing plan by technology', () => {
    cy.get('#input-search').type('xfs');
    cy.get('#input-search').should('have.value', 'xfs');

    cy.get('#plans-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a inexistent plan', () => {
    cy.get('#input-search').type('Inexistente');
    cy.get('#input-search').should('have.value', 'Inexistente');

    cy.get('#plans-list tr').should('have.length.lessThan', 1);
  });

  it('Should reset filters for plans', () => {
    cy.get('#input-search').type('Inexistente');
    cy.get('#input-search').should('have.value', 'Inexistente');

    cy.get('#plans-list tr').should('have.length.lessThan', 1);
    cy.get('#clear-filters').click();
    cy.get('#plans-list tr').should('have.length.greaterThan', 0);
  });
});
