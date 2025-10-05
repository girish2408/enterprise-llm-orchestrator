import { startServer } from './server.js';
import { MCPServer } from './mcp/server.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

async function main() {
  logger.info('Starting Enterprise LLM Orchestrator', {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    mcpStdio: env.MCP_STDIO,
  });

  // Start MCP server in stdio mode if requested
  if (env.MCP_STDIO) {
    logger.info('Starting MCP server in stdio mode');
    const mcpServer = new MCPServer(true);
    await mcpServer.startStdio();
  }

  // Always start Express server
  await startServer();
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main().catch((error) => {
  logger.error('Failed to start application:', error);
  process.exit(1);
});
