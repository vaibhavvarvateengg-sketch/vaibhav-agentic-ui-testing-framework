import { BrowserManager } from './browserManager.js';
import { logger } from '../utils/logger.js';

export type TestAction = {
  action: 'goto' | 'click' | 'fill' | 'assertText' | 'waitForSelector';
  selector?: string;
  value?: string;
};

export class TestExecutor {
  constructor(private browserManager: BrowserManager) {}

  async execute(steps: TestAction[]) {
    const page = this.browserManager.getPage();

    for (const [index, step] of steps.entries()) {
      logger.info(`Executing step ${index + 1}: ${JSON.stringify(step)}`);
      switch (step.action) {
        case 'goto':
          if (!step.value) throw new Error('goto step requires value (URL)');
          await page.goto(step.value);
          break;
        case 'click':
          if (!step.selector) throw new Error('click step requires selector');
          await page.click(step.selector);
          break;
        case 'fill':
          if (!step.selector || step.value === undefined) {
            throw new Error('fill step requires selector and value');
          }
          await page.fill(step.selector, step.value);
          break;
        case 'waitForSelector':
          if (!step.selector) throw new Error('waitForSelector step requires selector');
          await page.waitForSelector(step.selector);
          break;
        case 'assertText':
          if (!step.selector || step.value === undefined) {
            throw new Error('assertText step requires selector and value');
          }
          await page.waitForSelector(step.selector);
          const content = await page.textContent(step.selector);
          if (!content?.includes(step.value)) {
            throw new Error(`Assertion failed: expected text '${step.value}' in selector '${step.selector}', got '${content ?? ""}'`);
          }
          break;
        default:
          throw new Error(`Unsupported action: ${step.action}`);
      }
    }

    logger.info('Test execution completed successfully.');
  }
}
