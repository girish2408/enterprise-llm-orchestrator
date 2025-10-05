import { db } from '../services/db.js';
import { MessageRole } from '@prisma/client';
import { ToolInvocation } from '../types/index.js';

export class ChatRepository {
  async ensureThread(threadId?: string): Promise<{ id: string }> {
    if (threadId) {
      // Check if thread exists
      const existing = await db.client.thread.findUnique({
        where: { id: threadId },
      });
      if (existing) {
        return { id: existing.id };
      }
    }

    // Create new thread
    const thread = await db.client.thread.create({
      data: {},
    });

    return { id: thread.id };
  }

  async addMessage(
    threadId: string,
    role: MessageRole,
    content: string,
    meta?: Record<string, any>
  ): Promise<{ id: string }> {
    const message = await db.client.message.create({
      data: {
        threadId,
        role,
        content,
        meta: meta || {},
      },
    });

    return { id: message.id };
  }

  async getRecentMessages(threadId: string, limit = 25) {
    return db.client.message.findMany({
      where: { threadId },
      include: {
        toolCalls: true,
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  async addToolInvocation(
    messageId: string,
    toolInvocation: {
      toolName: string;
      input: Record<string, any>;
      output?: Record<string, any>;
      durationMs?: number;
    }
  ): Promise<{ id: string }> {
    const toolCall = await db.client.toolInvocation.create({
      data: {
        messageId,
        toolName: toolInvocation.toolName,
        input: toolInvocation.input,
        output: toolInvocation.output || {},
        durationMs: toolInvocation.durationMs,
      },
    });

    return { id: toolCall.id };
  }

  async updateThreadTitle(threadId: string, title: string): Promise<void> {
    await db.client.thread.update({
      where: { id: threadId },
      data: { title },
    });
  }

  async getThread(threadId: string) {
    return db.client.thread.findUnique({
      where: { id: threadId },
      include: {
        messages: {
          include: {
            toolCalls: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }
}

export const chatRepo = new ChatRepository();
