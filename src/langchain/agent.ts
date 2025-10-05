import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { chatRepo } from '../repositories/chatRepo.js';
import { callMcpTool } from '../mcp/server.js';
import { SYSTEM_PROMPT } from './prompts.js';
import { ToolInvocation } from '../types/index.js';
import { generateConversationSummary } from '../utils/summarizer.js';

export class EnterpriseAgent {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.1,
      openAIApiKey: env.OPENAI_API_KEY,
    });
  }

  async chat({
    threadId,
    message,
    stream = false,
  }: {
    threadId?: string;
    message: string;
    stream?: boolean;
  }): Promise<{
    threadId: string;
    response: string;
    toolCalls?: ToolInvocation[];
  }> {
    // Ensure thread exists
    const { id: actualThreadId } = await chatRepo.ensureThread(threadId);
    
    // Get recent messages for context
    const recentMessages = await chatRepo.getRecentMessages(actualThreadId, 25);
    
    // Add user message to database
    const { id: userMessageId } = await chatRepo.addMessage(
      actualThreadId,
      'user',
      message
    );

    // Build message history for LLM
    const messages = [
      new SystemMessage(SYSTEM_PROMPT),
      ...recentMessages.map(msg => {
        if (msg.role === 'user') {
          return new HumanMessage(msg.content);
        } else if (msg.role === 'assistant') {
          return new AIMessage(msg.content);
        }
        return new HumanMessage(msg.content); // fallback
      }),
      new HumanMessage(message),
    ];

    // Determine if we should use tools based on message content
    const shouldUseTools = this.shouldUseTools(message);
    
    let response = '';
    let toolCalls: ToolInvocation[] = [];

    if (shouldUseTools) {
      const toolResult = await this.executeToolCall(message, actualThreadId);
      response = toolResult.response;
      toolCalls = toolResult.toolCalls;
    } else {
      // Regular LLM response
      const llmResponse = await this.model.invoke(messages);
      response = llmResponse.content as string;
    }

    // Add assistant message to database
    await chatRepo.addMessage(
      actualThreadId,
      'assistant',
      response,
      {
        model: 'gpt-4',
        toolCalls: toolCalls.length > 0,
      }
    );

    // Update thread title if it's the first message
    if (recentMessages.length === 0) {
      const title = await generateConversationSummary(message, response, toolCalls);
      await chatRepo.updateThreadTitle(actualThreadId, title);
    }

    return {
      threadId: actualThreadId,
      response,
      toolCalls,
    };
  }

  async *chatStream({
    threadId,
    message,
  }: {
    threadId?: string;
    message: string;
  }): AsyncGenerator<string, void, unknown> {
    // Ensure thread exists
    const { id: actualThreadId } = await chatRepo.ensureThread(threadId);
    
    // Get recent messages for context
    const recentMessages = await chatRepo.getRecentMessages(actualThreadId, 25);
    
    // Add user message to database
    await chatRepo.addMessage(actualThreadId, 'user', message);

    // Build message history for LLM
    const messages = [
      new SystemMessage(SYSTEM_PROMPT),
      ...recentMessages.map(msg => {
        if (msg.role === 'user') {
          return new HumanMessage(msg.content);
        } else if (msg.role === 'assistant') {
          return new AIMessage(msg.content);
        }
        return new HumanMessage(msg.content);
      }),
      new HumanMessage(message),
    ];

    // Determine if we should use tools
    const shouldUseTools = this.shouldUseTools(message);
    
    let fullResponse = '';
    let toolCalls: ToolInvocation[] = [];

    if (shouldUseTools) {
      // For tool calls, we'll execute and then stream the response
      const toolResult = await this.executeToolCall(message, actualThreadId);
      fullResponse = toolResult.response;
      toolCalls = toolResult.toolCalls;
      
      // Stream the response word by word
      const words = fullResponse.split(' ');
      for (let i = 0; i < words.length; i++) {
        yield (i === 0 ? '' : ' ') + words[i];
        await new Promise(resolve => setTimeout(resolve, 50)); // Simulate streaming
      }
    } else {
      // Stream LLM response
      const stream = await this.model.stream(messages);
      
      for await (const chunk of stream) {
        const content = chunk.content as string;
        fullResponse += content;
        yield content;
      }
    }

    // Add assistant message to database
    await chatRepo.addMessage(
      actualThreadId,
      'assistant',
      fullResponse,
      {
        model: 'gpt-4',
        toolCalls: toolCalls.length > 0,
      }
    );

    // Update thread title if it's the first message
    if (recentMessages.length === 0) {
      const title = await generateConversationSummary(message, fullResponse, toolCalls);
      await chatRepo.updateThreadTitle(actualThreadId, title);
    }
  }

  private shouldUseTools(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    
    // Check for HR-related keywords
    const hrKeywords = ['leave', 'balance', 'employee', 'hr', 'vacation', 'sick'];
    if (hrKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return true;
    }
    
    // Check for CRM-related keywords
    const crmKeywords = ['customer', 'email', 'lookup', 'crm', 'client'];
    if (crmKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return true;
    }
    
    // Check for Banking-related keywords
    const bankingKeywords = ['portfolio', 'account', 'banking', 'investment', 'holdings'];
    if (bankingKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return true;
    }
    
    return false;
  }

  private async executeToolCall(
    message: string,
    threadId: string
  ): Promise<{
    response: string;
    toolCalls: ToolInvocation[];
  }> {
    const toolCalls: ToolInvocation[] = [];
    let response = '';

    try {
      // Simple routing logic based on message content
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('leave') || lowerMessage.includes('employee')) {
        // Extract employee ID (simple regex)
        const employeeIdMatch = message.match(/(\d{4})/);
        if (employeeIdMatch) {
          const employeeId = employeeIdMatch[1];
          
          const startTime = Date.now();
          const result = await callMcpTool('hr.getLeaveBalance', { employeeId });
          const durationMs = Date.now() - startTime;
          
          const toolCall: ToolInvocation = {
            id: `tool-${Date.now()}`,
            toolName: 'hr.getLeaveBalance',
            input: { employeeId },
            output: result.content[0],
            durationMs,
          };
          
          toolCalls.push(toolCall);
          
          response = `I retrieved the leave balance for employee ${employeeId}:\n\n` +
            `• Annual Leave: ${result.content[0].annual} days\n` +
            `• Sick Leave: ${result.content[0].sick} days\n` +
            `• Remaining: ${result.content[0].remaining} days\n\n` +
            `This information was retrieved using the HR system.`;
        }
      } else if (lowerMessage.includes('customer') || lowerMessage.includes('email')) {
        // Extract email (simple regex)
        const emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (emailMatch) {
          const email = emailMatch[1];
          
          const startTime = Date.now();
          const result = await callMcpTool('crm.lookupCustomer', { email });
          const durationMs = Date.now() - startTime;
          
          const toolCall: ToolInvocation = {
            id: `tool-${Date.now()}`,
            toolName: 'crm.lookupCustomer',
            input: { email },
            output: result.content[0],
            durationMs,
          };
          
          toolCalls.push(toolCall);
          
          response = `I found customer information for ${email}:\n\n` +
            `• Customer ID: ${result.content[0].id}\n` +
            `• Tier: ${result.content[0].tier}\n` +
            `• Last Order: ${result.content[0].lastOrder.date} ($${result.content[0].lastOrder.value})\n\n` +
            `This information was retrieved from the CRM system.`;
        }
      } else if (lowerMessage.includes('portfolio') || lowerMessage.includes('account')) {
        // Extract account ID (simple regex)
        const accountIdMatch = message.match(/(\d{3,})/);
        if (accountIdMatch) {
          const accountId = accountIdMatch[1];
          
          const startTime = Date.now();
          const result = await callMcpTool('banking.getPortfolioSummary', { accountId });
          const durationMs = Date.now() - startTime;
          
          const toolCall: ToolInvocation = {
            id: `tool-${Date.now()}`,
            toolName: 'banking.getPortfolioSummary',
            input: { accountId },
            output: result.content[0],
            durationMs,
          };
          
          toolCalls.push(toolCall);
          
          const holdings = result.content[0].topHoldings
            .map((h: any) => `${h.symbol} (${(h.weight * 100).toFixed(1)}%)`)
            .join(', ');
          
          response = `I retrieved the portfolio summary for account ${accountId}:\n\n` +
            `• Total Value: $${result.content[0].totalValue.toLocaleString()}\n` +
            `• P&L: ${result.content[0].pnlPct}%\n` +
            `• Top Holdings: ${holdings}\n\n` +
            `This information was retrieved from the banking system.`;
        }
      }
      
      if (!response) {
        response = "I understand you're asking about HR, CRM, or Banking data, but I couldn't extract the specific information needed (employee ID, email, or account ID) from your message. Could you please provide more specific details?";
      }
      
    } catch (error) {
      logger.error('Tool execution error:', error);
      response = `I encountered an error while retrieving the requested information: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    return { response, toolCalls };
  }
}

export const enterpriseAgent = new EnterpriseAgent();
