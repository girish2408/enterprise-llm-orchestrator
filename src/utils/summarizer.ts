import OpenAI from 'openai';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export async function generateConversationSummary(
  userMessage: string,
  assistantResponse: string,
  toolCalls?: Array<{ toolName: string; input: any; output: any }>
): Promise<string> {
  try {
    const prompt = `Generate a concise, descriptive title for this conversation. The title should be 3-8 words and capture the main intent or result.

User Message: "${userMessage}"

Assistant Response: "${assistantResponse}"

${toolCalls && toolCalls.length > 0 ? `Tools Used: ${toolCalls.map(tc => tc.toolName).join(', ')}` : ''}

Examples of good titles:
- "Employee Leave Balance Query"
- "Customer Information Lookup" 
- "Portfolio Summary Request"
- "Banking Account Details"
- "HR System Query"

Generate only the title, no other text:`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates concise, descriptive titles for conversations. Always respond with just the title, nothing else.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 20,
      temperature: 0.3,
    });

    const title = response.choices[0]?.message?.content?.trim();
    
    if (!title) {
      // Fallback to a simple title based on the user message
      return userMessage.length > 50 ? userMessage.substring(0, 50) + '...' : userMessage;
    }

    return title;
  } catch (error) {
    logger.error('Failed to generate conversation summary:', error);
    // Fallback to user message
    return userMessage.length > 50 ? userMessage.substring(0, 50) + '...' : userMessage;
  }
}
