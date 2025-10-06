import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { logger } from './config/logger.js';
import { env } from './config/env.js';
import { db } from './services/db.js';

// Import routes
import healthRouter from './routes/health.js';
import toolsRouter from './routes/tools.js';
import chatRouter from './routes/chat.js';
import dataRouter from './routes/data.js';
import entitiesRouter from './routes/entities.js';

export function createServer(): express.Application {
  const app = express();

  // Security middleware
  app.use(helmet());
  
  // CORS configuration
  app.use(cors({
    origin: env.NODE_ENV === 'production' ? false : true, // Allow all origins in dev
    credentials: true,
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // limit each IP to 60 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info('HTTP request', {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
    });
    
    next();
  });

  // Health check (no auth required)
  app.use('/healthz', healthRouter);

  // API routes (auth required)
  app.use('/tools', toolsRouter);
  app.use('/chat', chatRouter);
  app.use('/data', dataRouter);
  app.use('/entities', entitiesRouter);

  // Serve static files from frontend build (in production)
  if (env.NODE_ENV === 'production') {
    const frontendPath = path.join(process.cwd(), 'dist', 'public');
    app.use(express.static(frontendPath));
    
    // API info endpoint (before catch-all)
    app.get('/api/info', (req, res) => {
      res.json({
        name: 'Enterprise LLM Orchestrator',
        version: '1.0.0',
        description: 'Enterprise assistant with HR, CRM, and Banking tools',
        endpoints: {
          health: '/healthz',
          chat: '/chat',
          tools: '/tools',
        },
      });
    });
    
    // Catch-all handler: send back React's index.html file for client-side routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
  } else {
    // Development: API info endpoint
    app.get('/', (req, res) => {
      res.json({
        name: 'Enterprise LLM Orchestrator',
        version: '1.0.0',
        description: 'Enterprise assistant with HR, CRM, and Banking tools',
        endpoints: {
          health: '/healthz',
          chat: '/chat',
          tools: '/tools',
        },
      });
    });

    // 404 handler for development
    app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.originalUrl} not found`,
      });
    });
  }

  // Global error handler
  app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Unhandled error:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  });

  return app;
}

export async function startServer(): Promise<void> {
  try {
    // Connect to database (with retry logic)
    let connected = false;
    let attempts = 0;
    while (!connected && attempts < 5) {
      try {
        await db.connect();
        connected = true;
      } catch (error) {
        attempts++;
        logger.warn(`Database connection attempt ${attempts} failed, retrying in 2s...`);
        if (attempts >= 5) {
          logger.error('Failed to connect to database after 5 attempts, starting server anyway');
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Create and start Express server
    const app = createServer();
    
    const server = app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`, {
        nodeEnv: env.NODE_ENV,
        port: env.PORT,
      });
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);
      
      server.close(async () => {
        try {
          await db.disconnect();
          logger.info('Server shutdown complete');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}
