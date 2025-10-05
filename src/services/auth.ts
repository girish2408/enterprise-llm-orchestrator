import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey) {
    logger.warn('API request without API key', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
    });
    res.status(401).json({ error: 'API key required' });
    return;
  }
  
  if (apiKey !== env.API_KEY) {
    logger.warn('API request with invalid API key', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
    });
    res.status(401).json({ error: 'Invalid API key' });
    return;
  }
  
  next();
}
