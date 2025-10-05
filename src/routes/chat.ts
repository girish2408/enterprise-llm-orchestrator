import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { enterpriseAgent } from '../langchain/agent.js';
import { apiKeyAuth } from '../services/auth.js';
import { setupSSEHeaders, sendSSEMessage, sendSSEError, closeSSE } from '../utils/sse.js';
import { logger } from '../config/logger.js';

const router = Router();

// Apply auth middleware to all routes
router.use(apiKeyAuth);

const chatRequestSchema = z.object({
  threadId: z.string().uuid().optional(),
  message: z.string().min(1, 'Message cannot be empty'),
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { threadId, message } = chatRequestSchema.parse(req.body);
    const stream = req.query.stream === '1';

    if (stream) {
      // SSE streaming response
      setupSSEHeaders(res);
      
      try {
        const streamGenerator = enterpriseAgent.chatStream({ threadId, message });
        
        for await (const chunk of streamGenerator) {
          sendSSEMessage(res, { content: chunk });
        }
        
        closeSSE(res);
      } catch (error) {
        logger.error('SSE streaming error:', error);
        sendSSEError(res, 'Streaming error occurred');
        closeSSE(res);
      }
    } else {
      // Non-streaming response
      const result = await enterpriseAgent.chat({ threadId, message });
      
      res.json({
        threadId: result.threadId,
        message: result.response,
        toolCalls: result.toolCalls || [],
      });
    }
  } catch (error) {
    logger.error('Chat request error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
});

export default router;
