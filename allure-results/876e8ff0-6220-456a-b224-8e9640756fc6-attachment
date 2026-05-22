# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: demoqaAgenticJourney.spec.ts >> Agentic DemoQA Journey: Launch → Registration → Login → Wait → Logout
- Location: src\tests\demoqaAgenticJourney.spec.ts:106:1

# Error details

```
Error: page.waitForTimeout: Target page, context or browser has been closed
```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | const DEMOQA_URL = 'https://demoqa.com';
  4   | const FIRST_NAME = 'John';
  5   | const LAST_NAME = 'Doe';
  6   | const USERNAME = 'johndoe123';
  7   | const PASSWORD = 'Test@1234';
  8   | 
  9   | // ✅ FIX: Make it CI-compatible (no headed/maximize in CI)
  10  | test.use({
  11  |   headless: process.env.CI ? true : false,
  12  |   viewport: { width: 1920, height: 1080 },
  13  |   launchOptions: {
  14  |     args: []
  15  |   }
  16  | });
  17  | 
  18  | async function humanDelay(page: Page, min = 1000, max = 2000) {
  19  |   const ms = Math.floor(Math.random() * (max - min + 1)) + min;
> 20  |   await page.waitForTimeout(ms);
      |              ^ Error: page.waitForTimeout: Target page, context or browser has been closed
  21  | }
  22  | 
  23  | async function slowType(page: Page, selector: string, value: string) {
  24  |   await page.focus(selector);
  25  |   await page.type(selector, value, { delay: 100 });
  26  | }
  27  | 
  28  | async function launchApp(page: Page) {
  29  |   console.log('\n[1] Launch Application');
  30  |   await page.goto(DEMOQA_URL, { waitUntil: 'load' });
  31  |   await page.waitForSelector('#root div.home-content', { timeout: 15000 });
  32  |   await humanDelay(page);
  33  |   console.log('✓ DemoQA homepage loaded');
  34  | }
  35  | 
  36  | async function registerUser(page: Page) {
  37  |   console.log('\n[2] Registration Flow (START FIRST)');
  38  |   await page.goto(`${DEMOQA_URL}/login`, { waitUntil: 'load' });
  39  |   await page.waitForSelector('button#newUser', { timeout: 15000 });
  40  |   await humanDelay(page);
  41  | 
  42  |   console.log('→ Clicking New User');
  43  |   await page.click('button#newUser');
  44  |   await page.waitForSelector('input#firstname', { timeout: 15000 });
  45  |   await humanDelay(page);
  46  | 
  47  |   console.log('→ Filling registration form');
  48  |   await slowType(page, 'input#firstname', FIRST_NAME);
  49  |   await page.waitForTimeout(1000);
  50  |   await slowType(page, 'input#lastname', LAST_NAME);
  51  |   await page.waitForTimeout(1000);
  52  |   await slowType(page, 'input#userName', USERNAME);
  53  |   await page.waitForTimeout(1000);
  54  |   await slowType(page, 'input#password', PASSWORD);
  55  |   await page.waitForTimeout(1000);
  56  | 
  57  |   console.log('→ Submitting registration');
  58  |   await page.click('button#register');
  59  |   await humanDelay(page);
  60  | 
  61  |   const successMessage = await page.locator('text=User Register Successfully').first().isVisible().catch(() => false);
  62  |   const captchaVisible = await page.frameLocator('iframe[src*="recaptcha"]').locator('body').first().isVisible().catch(() => false);
  63  | 
  64  |   if (successMessage) {
  65  |     console.log('✓ Account created successfully');
  66  |   } else if (captchaVisible) {
  67  |     console.log('⚠ Registration simulated: CAPTCHA blocked submission');
  68  |   } else {
  69  |     console.log('⚠ Registration submit completed, verification step may require manual confirmation');
  70  |   }
  71  | }
  72  | 
  73  | async function loginUser(page: Page) {
  74  |   console.log('\n[3] Login Flow');
  75  |   await page.goto(`${DEMOQA_URL}/login`, { waitUntil: 'networkidle' });
  76  |   await page.waitForSelector('input#userName', { timeout: 15000 });
  77  |   await humanDelay(page);
  78  | 
  79  |   console.log('→ Entering credentials');
  80  |   await slowType(page, 'input#userName', USERNAME);
  81  |   await page.waitForTimeout(1000);
  82  |   await slowType(page, 'input#password', PASSWORD);
  83  |   await page.waitForTimeout(1000);
  84  | 
  85  |   await page.click('button#login');
  86  |   await page.waitForTimeout(2000);
  87  | 
  88  |   const profileUrlLoaded = await page.waitForURL(/.*\/profile/, { timeout: 15000 }).then(() => true).catch(() => false);
  89  |   const userLabelVisible = await page.locator('label#userName-value').isVisible().catch(() => false);
  90  | 
  91  |   if (!profileUrlLoaded && !userLabelVisible) {
  92  |     throw new Error('Login validation failed: profile page not loaded');
  93  |   }
  94  | 
  95  |   console.log('✓ Login successful');
  96  | }
  97  | 
  98  | async function logoutUser(page: Page) {
  99  |   console.log('\n[5] Logout Flow');
  100 |   await page.locator('button:has-text("Log out"), button:has-text("Logout")').first().click();
  101 |   await page.waitForSelector('input#userName', { timeout: 15000 });
  102 |   await page.waitForTimeout(2000);
  103 |   console.log('✓ Logged out and redirected to login page');
  104 | }
  105 | 
  106 | test('Agentic DemoQA Journey: Launch → Registration → Login → Wait → Logout', async ({ page }) => {
  107 |   try {
  108 |     await launchApp(page);
  109 |     await registerUser(page);
  110 |     await loginUser(page);
  111 | 
  112 |     console.log('\n[4] Stay on profile page for 5 seconds');
  113 |     await page.waitForTimeout(5000);
  114 |     console.log('✓ Wait complete');
  115 | 
  116 |     await logoutUser(page);
  117 |     console.log('\n🎉 DemoQA agentic journey completed successfully');
  118 |   } catch (error) {
  119 |     console.error('❌ Script failed:', error);
  120 |     await page.screenshot({ path: 'demoqa-agentic-failure.png', fullPage: true }).catch(() => undefined);
```