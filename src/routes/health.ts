import { Router, Request, Response } from 'express';
import { db } from '../services/db.js';
import { logger } from '../config/logger.js';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    let dbHealthy = false;
    try {
      dbHealthy = await db.healthCheck();
    } catch (error) {
      logger.warn('Database health check failed:', error);
      dbHealthy = false;
    }
    
    const health = {
      ok: true,
      timestamp: new Date().toISOString(),
      db: dbHealthy ? 'ok' : 'error',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };

    res.status(200).json(health);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      ok: false,
      timestamp: new Date().toISOString(),
      db: 'error',
      error: 'Health check failed',
    });
  }
});

export default router;
