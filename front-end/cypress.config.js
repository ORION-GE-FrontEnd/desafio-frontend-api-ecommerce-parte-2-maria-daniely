import { defineConfig } from 'cypress'; 
import path from 'path'; 

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return config;
    },
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts', 
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
  }
});