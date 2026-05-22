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
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'allure-results', detail: true }]
  ],
  //use: {
   // headless: true,
   // viewport: null,
    //launchOptions: {
    //  args: ['--start-maximized'],
   // },
  //  trace: 'retain-on-failure',

use: {
headless: true,
viewport: { width: 1920, height: 1080 }, // replace maximize
launchOptions: {
  args: []
},

trace: 'retain-on-failure',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  actionTimeout: 10_000,
},
};

export default config;
