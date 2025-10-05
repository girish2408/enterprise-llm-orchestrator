import { Router, Request, Response } from 'express';
import { db } from '../services/db.js';
import { apiKeyAuth } from '../services/auth.js';
import { logger } from '../config/logger.js';

const router = Router();

// Apply auth middleware to all routes
router.use(apiKeyAuth);

// Get conversation statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const [
      totalThreads,
      totalMessages,
      toolInvocations,
      recentThreads
    ] = await Promise.all([
      db.client.thread.count(),
      db.client.message.count(),
      db.client.toolInvocation.count(),
      db.client.thread.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: {
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' }
          }
        }
      })
    ]);

    res.json({
      totalThreads,
      totalMessages,
      toolInvocations,
      recentThreads: recentThreads.map(thread => ({
        id: thread.id,
        title: thread.title,
        lastMessage: thread.messages[0]?.content || 'No messages',
        updatedAt: thread.updatedAt
      }))
    });
  } catch (error) {
    logger.error('Failed to fetch conversation stats:', error);
    res.status(500).json({
      error: 'Failed to fetch conversation statistics',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get tool usage statistics
router.get('/tool-stats', async (req: Request, res: Response) => {
  try {
    const toolStats = await db.client.toolInvocation.groupBy({
      by: ['toolName'],
      _count: {
        toolName: true
      },
      orderBy: {
        _count: {
          toolName: 'desc'
        }
      }
    });

    res.json({
      toolUsage: toolStats.map(stat => ({
        toolName: stat.toolName,
        count: stat._count.toolName
      }))
    });
  } catch (error) {
    logger.error('Failed to fetch tool stats:', error);
    res.status(500).json({
      error: 'Failed to fetch tool statistics',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get recent conversations with tool calls
router.get('/recent-conversations', async (req: Request, res: Response) => {
  try {
    const conversations = await db.client.thread.findMany({
      take: 10,
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          where: {
            role: 'assistant'
          },
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            toolCalls: {
              take: 3,
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      }
    });

    res.json({
      conversations: conversations.map(thread => ({
        id: thread.id,
        title: thread.title,
        lastMessage: thread.messages[0]?.content || 'No messages',
        toolCalls: thread.messages[0]?.toolCalls?.map(tool => ({
          toolName: tool.toolName,
          input: tool.input,
          output: tool.output,
          duration: tool.durationMs
        })) || [],
        updatedAt: thread.updatedAt
      }))
    });
  } catch (error) {
    logger.error('Failed to fetch recent conversations:', error);
    res.status(500).json({
      error: 'Failed to fetch recent conversations',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
