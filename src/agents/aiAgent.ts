import OpenAI from 'openai';
import { TestAction } from '../framework/testExecutor.js';
import { logger } from '../utils/logger.js';

export class AIAgent {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async generateTestSteps(prompt: string): Promise<TestAction[]> {
    logger.info('Generating UI test steps from prompt...');

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an assistant that returns structured UI test steps as JSON.' },
        { role: 'user', content: `${prompt}\n\nRespond with a valid JSON array of steps only.` }
      ]
    });

    const text = response.choices?.[0]?.message?.content ?? '';
    logger.info(`AI responded with: ${text}`);

    try {
      const parsed = JSON.parse(text);
      return parsed as TestAction[];
    } catch (error) {
      throw new Error('Failed to parse AI output as JSON. Ensure the model returns valid JSON.');
    }
  }
}
