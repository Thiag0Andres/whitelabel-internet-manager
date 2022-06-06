describe('Forgot Password', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/forgot-password');
  });

  it('Forgot Password with valid email', () => {
    cy.get('#email').type('admin@provider.com', { delay: 125 });
    cy.get('#button-send-forgot-password').click();

    cy.wait(2000);
    cy.url().should('include', 'http://localhost:3000/login');
  });

  it('Forgot Password with invalid email', () => {
    cy.get('#email').type('invalid@provider.com', { delay: 125 });
    cy.get('#button-send-forgot-password').click();

    cy.wait(2000);
    cy.url().should('include', 'http://localhost:3000/forgot-password');
  });

  it('Forgot Password with empty field', () => {
    cy.get('#button-send-forgot-password').click();

    cy.wait(2000);
    cy.url().should('include', 'http://localhost:3000/forgot-password');
  });

  it('Should go to login screen', () => {
    cy.wait(3000);
    cy.get('#button-back-to-login').click();

    cy.wait(2000);
    cy.url().should('include', 'http://localhost:3000/login');
  });
});
