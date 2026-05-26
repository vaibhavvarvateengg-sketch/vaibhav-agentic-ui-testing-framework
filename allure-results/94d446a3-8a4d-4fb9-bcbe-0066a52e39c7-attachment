# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: demoqa.spec.ts >> DemoQA registration and login >> Register user and login @smoke @regression
- Location: src\tests\demoqa.spec.ts:24:3

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "https://demoqa.com/register", waiting until "networkidle"

```

```
Error: page.screenshot: Target page, context or browser has been closed
```

# Test source

```ts
  1  | import { mkdir, writeFile } from 'fs/promises';
  2  | import path from 'path';
  3  | import type { Page } from 'playwright';
  4  | import type { TestInfo } from '@playwright/test';
  5  | 
  6  | const SCREENSHOT_DIR = path.resolve(process.cwd(), 'test-results', 'screenshots');
  7  | const ALLURE_ENV_PATH = path.resolve(process.cwd(), 'allure-results', 'environment.properties');
  8  | 
  9  | function sanitizeFileName(name: string): string {
  10 |   return name.replace(/[^a-z0-9-_]/gi, '_').toLowerCase();
  11 | }
  12 | 
  13 | /**
  14 |  * Capture a screenshot and attach it to the current Playwright test report.
  15 |  */
  16 | export async function captureScreenshot(page: Page, stepName: string, testInfo?: TestInfo): Promise<string> {
  17 |   const fileName = `${sanitizeFileName(stepName)}-${Date.now()}.png`;
  18 |   const screenshotPath = path.join(SCREENSHOT_DIR, fileName);
  19 | 
  20 |   await mkdir(SCREENSHOT_DIR, { recursive: true });
> 21 |   await page.screenshot({ path: screenshotPath, fullPage: true });
     |              ^ Error: page.screenshot: Target page, context or browser has been closed
  22 | 
  23 |   if (testInfo) {
  24 |     await testInfo.attach(stepName, {
  25 |       path: screenshotPath,
  26 |       contentType: 'image/png'
  27 |     });
  28 |   }
  29 | 
  30 |   return screenshotPath;
  31 | }
  32 | 
  33 | /**
  34 |  * Attach a plain-text message to the Playwright report.
  35 |  */
  36 | export async function attachTestLog(testInfo: TestInfo, title: string, message: string): Promise<void> {
  37 |   await testInfo.attach(title, {
  38 |     body: message,
  39 |     contentType: 'text/plain'
  40 |   });
  41 | }
  42 | 
  43 | /**
  44 |  * Write environment metadata information for Allure reporting.
  45 |  */
  46 | export async function writeAllureEnvironmentInfo(environment: Record<string, string>): Promise<void> {
  47 |   await mkdir(path.dirname(ALLURE_ENV_PATH), { recursive: true });
  48 | 
  49 |   const content = Object.entries(environment)
  50 |     .map(([key, value]) => `${key}=${value}`)
  51 |     .join('\n');
  52 | 
  53 |   await writeFile(ALLURE_ENV_PATH, content, 'utf8');
  54 | }
  55 | 
```