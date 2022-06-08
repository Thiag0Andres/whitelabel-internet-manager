describe('Dashboard', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');

    cy.get('#email').type('admin@provider.com');
    cy.get('#password').type('a1b2c3d4e5');
    cy.get('#button-login').click();

    cy.wait(2000);
  });

  // Dashboard

  it('Should display the dashboard screen', () => {
    cy.url().should('include', 'http://localhost:3000/home/dashboard');
  });

  // Logs

  it('Should display the audit log screen', () => {
    cy.get('#log-de-auditoria').click();
    cy.url().should('include', 'http://localhost:3000/home/audit-log');
  });

  it('Should search for a existing log by activity', () => {
    cy.visit('http://localhost:3000/home/audit-log');
    cy.wait(2000);

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
    cy.visit('http://localhost:3000/home/audit-log');
    cy.wait(2000);

    cy.get('#input-search').type('Provedor Padrão');
    cy.get('#input-search').should('have.value', 'Provedor Padrão');

    cy.get('#logs-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing log by time', () => {
    cy.visit('http://localhost:3000/home/audit-log');
    cy.wait(2000);

    cy.get('#input-search').type('06:37h');
    cy.get('#input-search').should('have.value', '06:37h');

    cy.get('#logs-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing log by date', () => {
    cy.visit('http://localhost:3000/home/audit-log');
    cy.wait(2000);

    cy.get('#input-search').type('02/08/2021');
    cy.get('#input-search').should('have.value', '02/08/2021');

    cy.get('#logs-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a inexistent log', () => {
    cy.visit('http://localhost:3000/home/audit-log');
    cy.wait(2000);

    cy.get('#input-search').type('Inexistente');
    cy.get('#input-search').should('have.value', 'Inexistente');

    cy.get('#logs-list tr').should('have.length.lessThan', 1);
  });

  it('Should reset filters for logs', () => {
    cy.visit('http://localhost:3000/home/audit-log');
    cy.wait(2000);

    cy.get('#input-search').type('Inexistente');
    cy.get('#input-search').should('have.value', 'Inexistente');

    cy.get('#logs-list tr').should('have.length.lessThan', 1);
    cy.get('#clear-filters').click();
    cy.get('#logs-list tr').should('have.length.greaterThan', 0);
  });

  // Bills

  it('Should display the bills to receive screen', () => {
    cy.get('#contas-a-receber').click();
    cy.url().should('include', 'http://localhost:3000/home/bills-to-receive');
  });

  it('Should search for a existing bill by due date', () => {
    cy.visit('http://localhost:3000/home/bills-to-receive');
    cy.wait(2000);

    cy.get('#input-search').type('5/10/2021');
    cy.get('#input-search').should('have.value', '5/10/2021');

    cy.get('#bills-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing bill by name', () => {
    cy.visit('http://localhost:3000/home/bills-to-receive');
    cy.wait(2000);

    cy.get('#input-search').type('Testando Cliente');
    cy.get('#input-search').should('have.value', 'Testando Cliente');

    cy.get('#bills-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing bill by value', () => {
    cy.visit('http://localhost:3000/home/bills-to-receive');
    cy.wait(2000);

    cy.get('#input-search').type('150,00');
    cy.get('#input-search').should('have.value', '150,00');

    cy.get('#bills-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing bill by payment', () => {
    cy.visit('http://localhost:3000/home/bills-to-receive');
    cy.wait(2000);

    cy.get('#input-search').type('05/09/2021');
    cy.get('#input-search').should('have.value', '05/09/2021');

    cy.get('#bills-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing bill by note number', () => {
    cy.visit('http://localhost:3000/home/bills-to-receive');
    cy.wait(2000);

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
    cy.visit('http://localhost:3000/home/bills-to-receive');
    cy.wait(2000);

    cy.get('#input-search').type('Inexistente');
    cy.get('#input-search').should('have.value', 'Inexistente');

    cy.get('#bills-list tr').should('have.length.lessThan', 1);
  });

  it('Should open the modal filter', () => {
    cy.visit('http://localhost:3000/home/bills-to-receive');
    cy.wait(2000);

    cy.get('#button-filter').click();

    cy.get('#modal-filter').should('be.visible');

    cy.wait(2000);

    cy.get('#button-close-filter').click();
  });

  it('Should filter bill', () => {
    cy.visit('http://localhost:3000/home/bills-to-receive');
    cy.wait(2000);

    cy.get('#button-filter').click();

    cy.get('#modal-filter').should('be.visible');

    cy.wait(1000);
    cy.get('#check1').type('true');

    cy.get('#check2').type('true');

    cy.get('#button-filter-request').click();
  });

  it('Should reset filters for bills', () => {
    cy.visit('http://localhost:3000/home/bills-to-receive');
    cy.wait(2000);

    cy.get('#input-search').type('Inexistente');
    cy.get('#input-search').should('have.value', 'Inexistente');

    cy.get('#bills-list tr').should('have.length.lessThan', 1);
    cy.get('#clear-filters').click();
    cy.get('#bills-list tr').should('have.length.greaterThan', 0);
  });

  // Invoices

  it('Should display the invoices screen', () => {
    cy.get('#notas-fiscais').click();
    cy.url().should('include', 'http://localhost:3000/home/bill-of-sale');
  });

  it('Should search for a existing invoice by note number', () => {
    cy.visit('http://localhost:3000/home/bill-of-sale');
    cy.wait(2000);

    cy.get('#input-search').type('000000022');
    cy.get('#input-search').should('have.value', '000000022');

    cy.get('#invoices-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing invoice by name', () => {
    cy.visit('http://localhost:3000/home/bill-of-sale');
    cy.wait(2000);

    cy.get('#input-search').type('José Victor');
    cy.get('#input-search').should('have.value', 'José Victor');

    cy.get('#invoices-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing invoice by issue', () => {
    cy.visit('http://localhost:3000/home/bill-of-sale');
    cy.wait(2000);

    cy.get('#input-search').type('0/01/2022');
    cy.get('#input-search').should('have.value', '0/01/2022');

    cy.get('#invoices-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing invoice by value', () => {
    cy.visit('http://localhost:3000/home/bill-of-sale');
    cy.wait(2000);

    cy.get('#input-search').type('94,48');
    cy.get('#input-search').should('have.value', '94,48');

    cy.get('#invoices-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a inexistent invoice', () => {
    cy.visit('http://localhost:3000/home/bill-of-sale');
    cy.wait(2000);

    cy.get('#input-search').type('Inexistente');
    cy.get('#input-search').should('have.value', 'Inexistente');

    cy.get('#invoices-list tr').should('have.length.lessThan', 1);
  });

  it('Should open the modal filter', () => {
    cy.visit('http://localhost:3000/home/bill-of-sale');
    cy.wait(2000);

    cy.get('#button-filter').click();

    cy.get('#modal-filter').should('be.visible');

    cy.wait(2000);

    cy.get('#button-close-filter').click();
  });

  it('Should filter invoice', () => {
    cy.visit('http://localhost:3000/home/bill-of-sale');
    cy.wait(2000);

    cy.get('#button-filter').click();

    cy.get('#modal-filter').should('be.visible');

    cy.wait(1000);
    cy.get('#select-month').select('07');

    cy.get('#select-year').select('2021');

    cy.get('#button-filter-request').click();
  });

  it('Should reset filters for invoices', () => {
    cy.visit('http://localhost:3000/home/bill-of-sale');
    cy.wait(2000);

    cy.get('#input-search').type('Inexistente');
    cy.get('#input-search').should('have.value', 'Inexistente');

    cy.get('#invoices-list tr').should('have.length.lessThan', 1);
    cy.get('#clear-filters').click();
    cy.get('#invoices-list tr').should('have.length.greaterThan', 0);
  });

  // Plans

  it('Should display the service plans screen', () => {
    cy.get('#planos-de-serviço').click();
    cy.url().should('include', 'http://localhost:3000/home/service-plans');
  });

  it('Should search for a existing plan by name', () => {
    cy.visit('http://localhost:3000/home/service-plans');
    cy.wait(2000);

    cy.get('#input-search').type('Plano 100 Mega');
    cy.get('#input-search').should('have.value', 'Plano 100 Mega');

    cy.get('#plans-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing plan by download', () => {
    cy.visit('http://localhost:3000/home/service-plans');
    cy.wait(2000);

    cy.get('#input-search').type('50mb');
    cy.get('#input-search').should('have.value', '50mb');

    cy.get('#plans-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing plan by upload', () => {
    cy.visit('http://localhost:3000/home/service-plans');
    cy.wait(2000);

    cy.get('#input-search').type('20mb');
    cy.get('#input-search').should('have.value', '20mb');

    cy.get('#plans-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing plan by value', () => {
    cy.visit('http://localhost:3000/home/service-plans');
    cy.wait(2000);

    cy.get('#input-search').type('99,99');
    cy.get('#input-search').should('have.value', '99,99');

    cy.get('#plans-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing plan by technology', () => {
    cy.visit('http://localhost:3000/home/service-plans');
    cy.wait(2000);

    cy.get('#input-search').type('xfs');
    cy.get('#input-search').should('have.value', 'xfs');

    cy.get('#plans-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a inexistent plan', () => {
    cy.visit('http://localhost:3000/home/service-plans');
    cy.wait(2000);

    cy.get('#input-search').type('Inexistente');
    cy.get('#input-search').should('have.value', 'Inexistente');

    cy.get('#plans-list tr').should('have.length.lessThan', 1);
  });

  it('Should reset filters for plans', () => {
    cy.visit('http://localhost:3000/home/service-plans');
    cy.wait(2000);

    cy.get('#input-search').type('Inexistente');
    cy.get('#input-search').should('have.value', 'Inexistente');

    cy.get('#plans-list tr').should('have.length.lessThan', 1);
    cy.get('#clear-filters').click();
    cy.get('#plans-list tr').should('have.length.greaterThan', 0);
  });

  // Users

  it('Should display the users screen', () => {
    cy.get('#clientes').click();
    cy.url().should('include', 'http://localhost:3000/home/clients');
  });

  it('Should search for a existing client by name', () => {
    cy.visit('http://localhost:3000/home/clients');
    cy.wait(2000);

    cy.get('#input-search').type('José Victor');
    cy.get('#input-search').should('have.value', 'José Victor');

    cy.get('#users-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing client by CPF/CNPJ', () => {
    cy.visit('http://localhost:3000/home/clients');
    cy.wait(2000);

    cy.get('#input-search').type('791.744.880-07');
    cy.get('#input-search').should('have.value', '791.744.880-07');

    cy.get('#users-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a existing client by plan', () => {
    cy.visit('http://localhost:3000/home/clients');
    cy.wait(2000);

    cy.get('#input-search').type('10');
    cy.get('#input-search').should('have.value', '10');

    cy.get('#users-list tr').should('have.length.greaterThan', 0);
  });

  it('Should search for a inexistent client', () => {
    cy.visit('http://localhost:3000/home/clients');
    cy.wait(2000);

    cy.get('#input-search').type('Inexistente');
    cy.get('#input-search').should('have.value', 'Inexistente');

    cy.get('#users-list tr').should('have.length.lessThan', 1);
  });

  it('Should open the modal filter', () => {
    cy.visit('http://localhost:3000/home/clients');
    cy.wait(2000);

    cy.get('#button-filter').click();

    cy.get('#modal-filter').should('be.visible');

    cy.wait(2000);

    cy.get('#button-close-filter').click();
  });

  it('Should filter client', () => {
    cy.visit('http://localhost:3000/home/clients');
    cy.wait(2000);

    cy.get('#button-filter').click();

    cy.get('#modal-filter').should('be.visible');

    cy.wait(1000);
    cy.get('#check1').type('true');

    cy.get('#check2').type('true');

    cy.get('#button-filter-request').click();
  });

  it('Should reset filters for users', () => {
    cy.visit('http://localhost:3000/home/clients');
    cy.wait(2000);

    cy.get('#input-search').type('Inexistente');
    cy.get('#input-search').should('have.value', 'Inexistente');

    cy.get('#users-list tr').should('have.length.lessThan', 1);
    cy.get('#clear-filters').click();
    cy.get('#users-list tr').should('have.length.greaterThan', 0);
  });

  // Forgot Password

  it('Forgot Password with valid email', () => {
    cy.visit('http://localhost:3000/forgot-password');
    cy.wait(2000);

    cy.get('#email').type('admin@provider.com', { delay: 125 });
    cy.get('#button-send-forgot-password').click();

    cy.wait(2000);
    cy.url().should('include', 'http://localhost:3000/login');
  });

  it('Forgot Password with invalid email', () => {
    cy.visit('http://localhost:3000/forgot-password');
    cy.wait(2000);

    cy.get('#email').type('invalid@provider.com', { delay: 125 });
    cy.get('#button-send-forgot-password').click();

    cy.wait(2000);
    cy.url().should('include', 'http://localhost:3000/forgot-password');
  });

  it('Forgot Password with empty field', () => {
    cy.visit('http://localhost:3000/forgot-password');
    cy.wait(2000);

    cy.get('#button-send-forgot-password').click();

    cy.wait(2000);
    cy.url().should('include', 'http://localhost:3000/forgot-password');
  });

  it('Should go to login screen', () => {
    cy.visit('http://localhost:3000/forgot-password');

    cy.wait(3000);
    cy.get('#button-back-to-login').click();

    cy.wait(2000);
    cy.url().should('include', 'http://localhost:3000/login');
  });
});
