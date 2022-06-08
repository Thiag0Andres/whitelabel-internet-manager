/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://whitelabel-internet.herokuapp.com/login',
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);
      // include any other plugin code...

      // It's IMPORTANT to return the config object
      // with any changed environment variables
      return config;
    },
  },
  env: {
    codeCoverage: {
      exclude: [
        'src/containers/RegisterUser/index.tsx',
        'src/containers/RegisterServicePlans/index.tsx',
        'src/components/ContainerPage/index.tsx',
        'src/components/FormPerson/index.tsx',
        'src/components/FormPerson/validations.ts',
        'src/components/FormServicePlans/index.tsx',
        'src/components/Header/index.tsx',
        'src/components/InfoClient/index.tsx',
        'src/containers/ViewAuditLog/index.tsx',
        'src/containers/ViewBillsToReceive/index.tsx',
        'src/containers/ViewInvoice/index.tsx',
        'src/containers/ViewServicePlans/index.tsx',
        'src/services/functions.ts',
        'src/services/mask.ts',
        'src/services/validation.ts',
      ],
    },
  },
});
