# Run DemoQA test (no API key needed!)
npm run test:demoqa

# Run AI-powered test (requires OPENAI_API_KEY)
npm run test

# Build project
npm run buildimport { BrowserManager } from '../framework/browserManager.js';
import { TestExecutor } from '../framework/testExecutor.js';
import { AIAgent } from '../agents/aiAgent.js';
import { logger } from '../utils/logger.js';

async function runSampleTest() {
  const openAiKey = process.env.OPENAI_API_KEY;
  if (!openAiKey) {
    throw new Error('OPENAI_API_KEY is required in environment variables.');
  }

  const aiAgent = new AIAgent(openAiKey);
  const browserManager = new BrowserManager();
  const executor = new TestExecutor(browserManager);

  await browserManager.start(false);

  try {
    const prompt = `Create a Playwright UI test for the example web page at https://example.com. Use the following actions: goto, click, fill, waitForSelector, assertText. Return only JSON steps.`;
    const steps = await aiAgent.generateTestSteps(prompt);

    logger.info('Generated test steps:');
    console.log(JSON.stringify(steps, null, 2));

    await executor.execute(steps);
  } finally {
    await browserManager.close();
  }
}

runSampleTest().catch((error) => {
  logger.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
