describe('Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });

  it('Login with valid credentials', () => {
    cy.get('#email').type('admin@provider.com', { delay: 125 });
    cy.get('#password').type('a1b2c3d4e5', { delay: 125 });
    cy.get('#button-login').click();

    cy.wait(2000);
    cy.url().should('include', 'http://localhost:3000/home');
  });

  it('Login with invalid email', () => {
    cy.get('#email').type('invalid@provider.com', { delay: 125 });
    cy.get('#password').type('a1b2c3d4e5', { delay: 125 });
    cy.get('#button-login').click();

    cy.wait(2000);
    cy.url().should('include', 'http://localhost:3000/login');
  });

  it('Login with invalid password', () => {
    cy.get('#email').type('admin@provider.com', { delay: 125 });
    cy.get('#password').type('a1b2c3d4e6', { delay: 125 });
    cy.get('#button-login').click();

    cy.wait(2000);
    cy.url().should('include', 'http://localhost:3000/login');
  });

  it('Login with invalid credentials', () => {
    cy.get('#email').type('invalid@provider.com', { delay: 125 });
    cy.get('#password').type('a1b2c3d4e6', { delay: 125 });
    cy.get('#button-login').click();

    cy.wait(2000);
    cy.url().should('include', 'http://localhost:3000/login');
  });

  it('Login with empty fields', () => {
    cy.get('#button-login').click();

    cy.wait(2000);
    cy.url().should('include', 'http://localhost:3000/login');
  });

  it('Should go to forgot password screen', () => {
    cy.wait(3000);
    cy.get('#button-forgot-password').click();

    cy.wait(2000);
    cy.url().should('include', 'http://localhost:3000/forgot-password');
  });
});
