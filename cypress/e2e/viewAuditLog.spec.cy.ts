describe('Audit log', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');

    cy.get('#email').type('admin@provider.com');
    cy.get('#password').type('a1b2c3d4e5');
    cy.get('#button-login').click();

    cy.wait(2000);
    cy.get('#log-de-auditoria').click();
  });

  it('Should display the audit log screen', () => {
    cy.url().should('include', 'http://localhost:3000/home/audit-log');
  });

  it('Should search for a existing log by activity', () => {
    cy.get('#input-search').type(
      'Provedor Padrão criou um plano de nome Plano 50 MB.',
    );
    cy.get('#input-search').should(
      'have.value',
      'Provedor Padrão criou um plano de nome Plano 50 MB.',
    );

    cy.get('#logs-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing log by author', () => {
    cy.get('#input-search').type('Provedor Padrão');
    cy.get('#input-search').should('have.value', 'Provedor Padrão');

    cy.get('#logs-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing log by time', () => {
    cy.get('#input-search').type('06:37h');
    cy.get('#input-search').should('have.value', '06:37h');

    cy.get('#logs-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing log by date', () => {
    cy.get('#input-search').type('02/08/2021');
    cy.get('#input-search').should('have.value', '02/08/2021');

    cy.get('#logs-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a inexistent log', () => {
    cy.get('#input-search').type('Inexistente');
    cy.get('#input-search').should('have.value', 'Inexistente');

    cy.get('#logs-list tr').should('have.length.lessThan', 1);
  });

  it('Should reset filters for logs', () => {
    cy.get('#input-search').type('Inexistente');
    cy.get('#input-search').should('have.value', 'Inexistente');

    cy.get('#logs-list tr').should('have.length.lessThan', 1);
    cy.get('#clear-filters').click();
    cy.get('#logs-list tr').should('have.length.greaterThan', 0);
  });
});
