import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './src/tests',
  timeout: 60_000,

  expect: {
    timeout: 10_000,
  },

  fullyParallel: false,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'always' }],
    ['allure-playwright', { outputFolder: 'allure-results', detail: true }]
  ],

  use: {
    // 
    headless: true,   //  change to true for headless

    viewport: { width: 1920, height: 1080 },

    launchOptions: {
      args: [] //  no maximize to keep it simple
    },

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },

  workers: 1
};

export default config;
