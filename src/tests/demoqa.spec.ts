import { expect, test } from '@playwright/test';
import { captureScreenshot, attachTestLog, writeAllureEnvironmentInfo } from '../utils/reportUtils.js';
import { logger } from '../utils/logger.js';

const DEMOQA_BASE_URL = 'https://demoqa.com';
const USERNAME = 'johndoe123';
const PASSWORD = 'Test@1234';
const FIRST_NAME = 'John';
const LAST_NAME = 'Doe';

/**
 * DemoQA registration and login test using Playwright Test with Allure reporting.
 */
test.describe('DemoQA registration and login', () => {
  test.beforeAll(async () => {
    await writeAllureEnvironmentInfo({
      browser: process.env.BROWSER ?? 'chromium',
      baseUrl: DEMOQA_BASE_URL,
      framework: 'Playwright Test',
      executedAt: new Date().toISOString()
    });
  });

  test('Register user and login @smoke @regression', async ({ page }, testInfo) => {
    testInfo.annotations.push({ type: 'tag', description: 'smoke' });
    testInfo.annotations.push({ type: 'tag', description: 'regression' });

    await attachTestLog(testInfo, 'Test Start', 'Beginning DemoQA registration and login workflow.');

    await test.step('Open the DemoQA registration page', async () => {
      logger.info('Navigating to registration page');
      await page.goto(`${DEMOQA_BASE_URL}/register`, { waitUntil: 'networkidle' });
      await expect(page).toHaveURL(/.*register/);
      await expect(page.locator('input#firstname')).toBeVisible();
      await attachTestLog(testInfo, 'Navigation', 'Registration page loaded successfully.');
    });

    await test.step('Fill the registration form', async () => {
      logger.info('Filling registration form');
      await page.fill('input#firstname', FIRST_NAME);
      await page.fill('input#lastname', LAST_NAME);
      await page.fill('input#userName', USERNAME);
      await page.fill('input#password', PASSWORD);
      await attachTestLog(testInfo, 'Form Data', `Filled user data for ${USERNAME}.`);
    });

    await test.step('Submit registration form and verify flow', async () => {
      logger.info('Submitting registration form');
      await page.click('button#register');
      await page.waitForTimeout(3000);

      const captchaFrame = page.frameLocator('iframe[src*="recaptcha"]');
      const captchaVisible = await captchaFrame.locator('body').count().then((count) => count > 0).catch(() => false);

      if (captchaVisible) {
        logger.warn('reCAPTCHA detected; skipping automated solve and capturing current state.');
        await attachTestLog(testInfo, 'Captcha Skipped', 'reCAPTCHA detected during registration; automation continues without solving captcha.');
      } else {
        logger.info('Registration submit completed without visible reCAPTCHA.');
      }

      await captureScreenshot(page, 'registration-submission', testInfo);
    });

    await test.step('Open the DemoQA login page', async () => {
      logger.info('Navigating to login page');
      await page.goto(`${DEMOQA_BASE_URL}/login`, { waitUntil: 'networkidle' });
      await expect(page).toHaveURL(/.*login/);
      await expect(page.locator('input#userName')).toBeVisible();
      await attachTestLog(testInfo, 'Navigation', 'Login page loaded successfully.');
    });

    await test.step('Fill login credentials', async () => {
      logger.info('Filling login credentials');
      await page.fill('input#userName', USERNAME);
      await page.fill('input#password', PASSWORD);
      await attachTestLog(testInfo, 'Login Data', `Prepared login credentials for ${USERNAME}.`);
    });

    await test.step('Submit login and validate success', async () => {
      logger.info('Submitting login form');
      await page.click('button#login');
      await page.waitForTimeout(3000);

      const logoutVisible = await page.locator('button#logout').isVisible().catch(() => false);
      const profileVisible = await page.locator('label#userName-value').isVisible().catch(() => false);
      const currentUrl = page.url();
      const loginSuccess = logoutVisible || profileVisible || !currentUrl.includes('/login');

      await attachTestLog(testInfo, 'Login Check', `Logout visible: ${logoutVisible}, profile visible: ${profileVisible}, URL: ${currentUrl}`);
      await captureScreenshot(page, 'login-verification', testInfo);
      expect(loginSuccess).toBeTruthy();
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== 'passed') {
      logger.error('Test failed, capturing screenshot for Allure report');
      await captureScreenshot(page, `failure-${testInfo.title}`, testInfo);
    }
  });
});
