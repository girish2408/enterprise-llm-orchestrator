import OpenAI from 'openai';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export async function generateNotFoundResponse(
  entityType: string,
  entityId: string,
  systemName: string,
  errorType: string = 'not found'
): Promise<string> {
  try {
    const prompt = `Generate a professional, helpful response for when a ${entityType} is not found in the ${systemName}.

Entity Type: ${entityType}
Entity ID: ${entityId}
System: ${systemName}
Error Type: ${errorType}

The response should be:
- Professional and polite
- Explain that the ${entityType} was not found
- Suggest possible next steps
- Be concise (1-2 sentences)

Examples:
- "I couldn't find employee 9999 in our HR system. Please verify the employee ID or contact HR for assistance."
- "Customer email not found in our CRM system. Please check the email address or contact sales for help."
- "Account not found in our banking system. Please verify the account number or contact customer service."

Generate only the response message:`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates professional error messages for enterprise systems. Always respond with just the message, nothing else.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 100,
      temperature: 0.3,
    });

    const message = response.choices[0]?.message?.content?.trim();
    
    if (!message) {
      // Fallback response
      return `I couldn't find ${entityType} ${entityId} in our ${systemName}. Please verify the ${entityType} ID and try again.`;
    }

    return message;
  } catch (error) {
    logger.error('Failed to generate GPT response:', error);
    // Fallback response
    return `I couldn't find ${entityType} ${entityId} in our ${systemName}. Please verify the ${entityType} ID and try again.`;
  }
}
