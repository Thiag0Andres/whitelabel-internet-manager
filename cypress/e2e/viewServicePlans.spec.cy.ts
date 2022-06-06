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
});
