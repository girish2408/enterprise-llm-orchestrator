import { Router, Request, Response } from 'express';
import { getAllTools } from '../mcp/tools/registry.js';
import { apiKeyAuth } from '../services/auth.js';

const router = Router();

// Apply auth middleware to all routes
router.use(apiKeyAuth);

router.get('/', (req: Request, res: Response) => {
  try {
    const tools = getAllTools();
    
    const toolsList = tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    }));

    res.json({
      tools: toolsList,
      count: toolsList.length,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve tools',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
