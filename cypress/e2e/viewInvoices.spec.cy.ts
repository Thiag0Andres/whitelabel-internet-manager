describe('Invoices', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');

    cy.get('#email').type('admin@provider.com');
    cy.get('#password').type('a1b2c3d4e5');
    cy.get('#button-login').click();

    cy.wait(2000);
    cy.get('#notas-fiscais').click();
  });

  it('Should display the invoices screen', () => {
    cy.url().should('include', 'http://localhost:3000/home/bill-of-sale');
  });

  it('Should search for a existing invoice by note number', () => {
    cy.get('#input-search').type('000000022');
    cy.get('#input-search').should('have.value', '000000022');

    cy.get('#invoices-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing invoice by name', () => {
    cy.get('#input-search').type('José Victor');
    cy.get('#input-search').should('have.value', 'José Victor');

    cy.get('#invoices-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing invoice by issue', () => {
    cy.get('#input-search').type('0/01/2022');
    cy.get('#input-search').should('have.value', '0/01/2022');

    cy.get('#invoices-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing invoice by value', () => {
    cy.get('#input-search').type('94,48');
    cy.get('#input-search').should('have.value', '94,48');

    cy.get('#invoices-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a inexistent invoice', () => {
    cy.get('#input-search').type('Inexistente');
    cy.get('#input-search').should('have.value', 'Inexistente');

    cy.get('#invoices-list tr').should('have.length.lessThan', 1);
  });

  it('Should open the modal filter', () => {
    cy.get('#button-filter').click();

    cy.get('#modal-filter').should('be.visible');

    cy.wait(2000);

    cy.get('#button-close-filter').click();
  });

  it('Should filter invoice', () => {
    cy.get('#button-filter').click();

    cy.get('#modal-filter').should('be.visible');

    cy.wait(1000);
    cy.get('#select-month').select('07');

    cy.get('#select-year').select('2021');

    cy.get('#button-filter-request').click();
  });

  it('Should reset filters for invoices', () => {
    cy.get('#input-search').type('Inexistente');
    cy.get('#input-search').should('have.value', 'Inexistente');

    cy.get('#invoices-list tr').should('have.length.lessThan', 1);
    cy.get('#clear-filters').click();
    cy.get('#invoices-list tr').should('have.length.greaterThan', 0);
  });
});
