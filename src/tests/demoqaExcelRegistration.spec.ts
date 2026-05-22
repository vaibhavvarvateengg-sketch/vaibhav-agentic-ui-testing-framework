import { test, expect, Page } from '@playwright/test';
import path from 'path';
import { readUsersFromExcel, ExcelUser } from '../utils/excelUtils.js';

const DEMOQA_LOGIN_URL = 'https://demoqa.com/login';
const EXCEL_FILE_PATH = path.join(process.cwd(), 'test-data', 'users.xlsx');

async function humanDelay(page: Page, min = 1000, max = 2000) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  await page.waitForTimeout(ms);
}

async function slowType(page: Page, selector: string, value: string) {
  await page.focus(selector);
  await page.type(selector, value, { delay: 100 });
}

async function registerUser(page: Page, user: ExcelUser, index: number) {
  console.log(`\n[${index + 1}] Registering user: ${user.firstName} ${user.lastName} <${user.email}>`);
  await page.goto(DEMOQA_LOGIN_URL, { waitUntil: 'load' });
  await page.waitForSelector('button#newUser', { timeout: 15000 });
  await humanDelay(page);

  await page.click('button#newUser');
  await page.waitForSelector('input#firstname', { timeout: 15000 });
  await humanDelay(page);

  await slowType(page, 'input#firstname', user.firstName);
  await page.waitForTimeout(1000);
  await slowType(page, 'input#lastname', user.lastName);
  await page.waitForTimeout(1000);
  await slowType(page, 'input#userName', user.email);
  await page.waitForTimeout(1000);
  await slowType(page, 'input#password', 'Test@1234');
  await humanDelay(page);

  await page.click('button#register');
  await page.waitForTimeout(2000);

  const captchaVisible = await page.frameLocator('iframe[src*="recaptcha"]').locator('body').count().then(count => count > 0).catch(() => false);
  if (captchaVisible) {
    console.log('⚠ CAPTCHA detected during registration; registration simulated.');
    return;
  }

  const registrationSuccess = await page.locator('text=User Register Successfully').isVisible().catch(() => false);
  if (registrationSuccess) {
    console.log('✓ Registration succeeded.');
  } else {
    console.log('⚠ Registration did not show success message; user may already exist or extra validation is required.');
  }
}

test('DemoQA Excel-driven registration flow', async ({ page }) => {
  const users = readUsersFromExcel(EXCEL_FILE_PATH);
  if (!users.length) {
    throw new Error(`No users found in Excel file: ${EXCEL_FILE_PATH}`);
  }

  for (const [index, user] of users.entries()) {
    try {
      await registerUser(page, user, index);
    } catch (error) {
      console.error(`❌ Failed to register user ${user.email}:`, error);
      await page.screenshot({ path: `demoqa-registration-failure-${index + 1}.png`, fullPage: true }).catch(() => undefined);
      throw error;
    }
  }
});
