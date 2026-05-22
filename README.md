# Agentic AI-Based UI Testing Framework

A modern TypeScript/Node.js framework for automated UI testing combining Playwright browser automation with OpenAI-powered test generation.

## Project Structure

```
src/
├── framework/           # Core testing framework
│   ├── browserManager.ts    # Browser lifecycle management
│   └── demoqa.spec.ts   # Playwright Test runner demo with Allure reporting
│   └── testExecutor.ts      # Test execution engine
├── agents/             # AI agents for test generation
│   └── reportUtils.ts   # Screenshot and Allure helper utilities
│   └── aiAgent.ts       # OpenAI integration for step generation
├── tests/              # Test suites
│   ├── sampleTest.ts    # AI-driven sample test (requires OpenAI API)
│   └── demoQATest.ts    # DemoQA registration/login test
├── utils/              # Utility functions
│   └── logger.ts        # Logging utility
└── index.ts           # Main exports
```

## Features

- **Playwright Integration**: Full browser automation capabilities
- **OpenAI Integration**: AI-powered test step generation
- **Modular Architecture**: Clean separation of concerns
- **TypeScript**: Full type safety and IntelliSense support
- **Error Handling**: Comprehensive error management with try-catch
- **Logging**: Built-in logging utility for debugging

## Installation

```bash
npm install
```

## Configuration

### For AI-powered tests:
Set up OpenAI API key:
```bash
set OPENAI_API_KEY=your_api_key_here
```

## Running Tests

### DemoQA Test (No API Key Required)
This test performs registration and login on demoqa.com:

```bash
npm run test:demoqa
```

**What it does:**
1. Launches a browser (non-headless for visibility)
2. Navigates to DemoQA registration page
3. Fills registration form with:
   - First Name: John
   - Last Name: Doe
   - Username: johndoe123
   - Password: Test@1234
4. Attempts registration (handles reCAPTCHA gracefully)
5. Navigates to login page
6. Logs in with the same credentials
7. Validates successful login

**Note:** The registration may be blocked by reCAPTCHA, which is expected behavior in automated testing. The test validates the flow structure and demonstrates proper error handling.

### AI-Powered Sample Test (Requires OpenAI API Key)
```bash
npm run test
```

### Playwright Test + Allure Reporting
Run the Playwright test suite with Allure integration:
```bash
npm run test:ui
```

Generate the Allure report after execution:
```bash
npm run report:generate
```

Open the generated Allure report in the browser:
```bash
npm run report:open
```

## Build

Compile TypeScript to JavaScript:
```bash
npm run build
```

## Code Organization

### Playwright Config (`playwright.config.ts`)
Defines the Playwright test runner configuration and enables HTML and Allure reporters.

### Reporting Utilities (`src/utils/reportUtils.ts`)
Reusable helper functions for:
- screenshot capture
- attaching custom logs to test reports
- writing Allure environment metadata

### BrowserManager (`src/framework/browserManager.ts`)
Handles browser lifecycle:
- Launch browser
- Create context and pages
- Close browser resources

```typescript
const browserManager = new BrowserManager();
await browserManager.start(false); // false = non-headless
const page = browserManager.getPage();
await browserManager.close();
```

### TestExecutor (`src/framework/testExecutor.ts`)
Executes predefined test actions:
- goto: Navigate to URL
- click: Click element
- fill: Fill input field
- waitForSelector: Wait for element
- assertText: Verify text content

```typescript
const executor = new TestExecutor(browserManager);
await executor.execute([
  { action: 'goto', value: 'https://example.com' },
  { action: 'click', selector: 'button' }
]);
```

### AIAgent (`src/agents/aiAgent.ts`)
Generates test steps using OpenAI:
```typescript
const agent = new AIAgent(apiKey);
const steps = await agent.generateTestSteps('Test login on example.com');
```

### DemoQA Test Suite (`src/tests/demoQATest.ts`)
Reusable test functions:
- `launchBrowser()`: Initialize browser
- `registerUser()`: Handle registration flow
- `loginUser()`: Validate login flow
- `closeBrowser()`: Cleanup resources

## Selectors Used (DemoQA)

### Registration Page
- First Name: `input#firstname`
- Last Name: `input#lastname`
- Username: `input#userName`
- Password: `input#password`
- Register Button: `button#register`

### Login Page
- Username: `input#userName`
- Password: `input#password`
- Login Button: `button#login`
- Logout Button: `button#logout`

## Error Handling

All test functions include comprehensive error handling:
- Try-catch blocks for error capture
- Timeout management for element loading
- Graceful handling of optional elements (reCAPTCHA)
- Detailed logging for debugging

## Example: Creating a New Test

```typescript
import { BrowserManager } from '../framework/browserManager.js';
import { TestExecutor } from '../framework/testExecutor.js';
import { TestAction } from '../framework/testExecutor.js';

async function myTest() {
  const browserManager = new BrowserManager();
  await browserManager.start(false);

  try {
    const steps: TestAction[] = [
      { action: 'goto', value: 'https://example.com' },
      { action: 'fill', selector: 'input[name="email"]', value: 'test@example.com' },
      { action: 'click', selector: 'button[type="submit"]' },
      { action: 'waitForSelector', selector: '.success-message' },
      { action: 'assertText', selector: '.success-message', value: 'Success' }
    ];

    const executor = new TestExecutor(browserManager);
    await executor.execute(steps);
  } finally {
    await browserManager.close();
  }
}

myTest().catch(console.error);
```

## Development

Watch mode for development:
```bash
npm run dev
```

Compile without emitting:
```bash
npx tsc --noEmit
```

## Dependencies

- **playwright**: Browser automation
- **openai**: AI-powered test generation
- **typescript**: Type safety
- **node**: Runtime (v16+)

- **@playwright/test**: Playwright Test runner
- **allure-playwright**: Allure reporter plugin
- **allure-commandline**: Allure report generation and opening

## Notes

- reCAPTCHA blocks automated testing - the framework handles this gracefully
- Tests run non-headless by default for visibility (set to `true` for CI/CD)
- All selectors are based on current DemoQA page structure
- Logging provides full visibility into test execution

## Future Enhancements

- Support for additional AI models (Claude, Gemini, etc.)
- Screenshot/video capture on failures
- Test reporting and metrics
- Parallel test execution
- Integration with CI/CD pipelines
- Support for mobile testing
