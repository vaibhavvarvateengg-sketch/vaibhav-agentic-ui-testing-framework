import { test, expect, Page } from '@playwright/test';

const DEMOQA_URL = 'https://demoqa.com';
const FIRST_NAME = 'John';
const LAST_NAME = 'Doe';
const USERNAME = 'johndoe123';
const PASSWORD = 'Test@1234';

// Ensure browser opens in non-headless mode and maximized for demo flow.
test.use({ headless: false, viewport: null, launchOptions: { args: ['--start-maximized'] } });

async function humanDelay(page: Page, min = 1000, max = 2000) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  await page.waitForTimeout(ms);
}

async function slowType(page: Page, selector: string, value: string) {
  await page.focus(selector);
  await page.type(selector, value, { delay: 100 });
}

async function launchApp(page: Page) {
  console.log('\n[1] Launch Application');
  await page.goto(DEMOQA_URL, { waitUntil: 'load' });
  await page.waitForSelector('#root div.home-content', { timeout: 15000 });
  await humanDelay(page);
  console.log('✓ DemoQA homepage loaded');
}

async function registerUser(page: Page) {
  console.log('\n[2] Registration Flow (START FIRST)');
  await page.goto(`${DEMOQA_URL}/login`, { waitUntil: 'load' });
  await page.waitForSelector('button#newUser', { timeout: 15000 });
  await humanDelay(page);

  console.log('→ Clicking New User');
  await page.click('button#newUser');
  await page.waitForSelector('input#firstname', { timeout: 15000 });
  await humanDelay(page);

  console.log('→ Filling registration form');
  await slowType(page, 'input#firstname', FIRST_NAME);
  await page.waitForTimeout(1000);
  await slowType(page, 'input#lastname', LAST_NAME);
  await page.waitForTimeout(1000);
  await slowType(page, 'input#userName', USERNAME);
  await page.waitForTimeout(1000);
  await slowType(page, 'input#password', PASSWORD);
  await page.waitForTimeout(1000);

  console.log('→ Submitting registration');
  await page.click('button#register');
  await humanDelay(page);

  const successMessage = await page.locator('text=User Register Successfully').first().isVisible().catch(() => false);
  const captchaVisible = await page.frameLocator('iframe[src*="recaptcha"]').locator('body').first().isVisible().catch(() => false);

  if (successMessage) {
    console.log('✓ Account created successfully');
  } else if (captchaVisible) {
    console.log('⚠ Registration simulated: CAPTCHA blocked submission');
  } else {
    console.log('⚠ Registration submit completed, verification step may require manual confirmation');
  }
}

async function loginUser(page: Page) {
  console.log('\n[3] Login Flow');
  await page.goto(`${DEMOQA_URL}/login`, { waitUntil: 'networkidle' });
  await page.waitForSelector('input#userName', { timeout: 15000 });
  await humanDelay(page);

  console.log('→ Entering credentials');
  await slowType(page, 'input#userName', USERNAME);
  await page.waitForTimeout(1000);
  await slowType(page, 'input#password', PASSWORD);
  await page.waitForTimeout(1000);

  await page.click('button#login');
  await page.waitForTimeout(2000);

  const profileUrlLoaded = await page.waitForURL(/.*\/profile/, { timeout: 15000 }).then(() => true).catch(() => false);
  const userLabelVisible = await page.locator('label#userName-value').isVisible().catch(() => false);

  if (!profileUrlLoaded && !userLabelVisible) {
    throw new Error('Login validation failed: profile page not loaded');
  }

  console.log('✓ Login successful');
}

async function logoutUser(page: Page) {
  console.log('\n[5] Logout Flow');
  await page.locator('button:has-text("Log out"), button:has-text("Logout")').first().click();
  await page.waitForSelector('input#userName', { timeout: 15000 });
  await page.waitForTimeout(2000);
  console.log('✓ Logged out and redirected to login page');
}

test('Agentic DemoQA Journey: Launch → Registration → Login → Wait → Logout', async ({ page }) => {
  try {
    await launchApp(page);
    await registerUser(page);
    await loginUser(page);

    console.log('\n[4] Stay on profile page for 5 seconds');
    await page.waitForTimeout(5000);
    console.log('✓ Wait complete');

    await logoutUser(page);
    console.log('\n🎉 DemoQA agentic journey completed successfully');
  } catch (error) {
    console.error('❌ Script failed:', error);
    await page.screenshot({ path: 'demoqa-agentic-failure.png', fullPage: true }).catch(() => undefined);
    throw error;
  }
});
