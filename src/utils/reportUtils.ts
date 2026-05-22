import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import type { Page } from 'playwright';
import type { TestInfo } from '@playwright/test';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'test-results', 'screenshots');
const ALLURE_ENV_PATH = path.resolve(process.cwd(), 'allure-results', 'environment.properties');

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-z0-9-_]/gi, '_').toLowerCase();
}

/**
 * Capture a screenshot and attach it to the current Playwright test report.
 */
export async function captureScreenshot(page: Page, stepName: string, testInfo?: TestInfo): Promise<string> {
  const fileName = `${sanitizeFileName(stepName)}-${Date.now()}.png`;
  const screenshotPath = path.join(SCREENSHOT_DIR, fileName);

  await mkdir(SCREENSHOT_DIR, { recursive: true });
  await page.screenshot({ path: screenshotPath, fullPage: true });

  if (testInfo) {
    await testInfo.attach(stepName, {
      path: screenshotPath,
      contentType: 'image/png'
    });
  }

  return screenshotPath;
}

/**
 * Attach a plain-text message to the Playwright report.
 */
export async function attachTestLog(testInfo: TestInfo, title: string, message: string): Promise<void> {
  await testInfo.attach(title, {
    body: message,
    contentType: 'text/plain'
  });
}

/**
 * Write environment metadata information for Allure reporting.
 */
export async function writeAllureEnvironmentInfo(environment: Record<string, string>): Promise<void> {
  await mkdir(path.dirname(ALLURE_ENV_PATH), { recursive: true });

  const content = Object.entries(environment)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  await writeFile(ALLURE_ENV_PATH, content, 'utf8');
}
