import { z } from 'zod';
import { getTool } from './tools/registry.js';
import { logger } from '../config/logger.js';
import { MCPToolCall, MCPToolResult } from '../types/index.js';

interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: any;
}

interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export class MCPServer {
  private isStdioMode: boolean;

  constructor(isStdioMode = false) {
    this.isStdioMode = isStdioMode;
  }

  async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    try {
      switch (request.method) {
        case 'initialize':
          return this.handleInitialize(request);
        case 'tools/list':
          return this.handleToolsList(request);
        case 'tools/call':
          return this.handleToolsCall(request);
        default:
          return this.createErrorResponse(request.id, -32601, 'Method not found');
      }
    } catch (error) {
      logger.error('MCP request error:', error);
      return this.createErrorResponse(request.id, -32603, 'Internal error', error);
    }
  }

  private handleInitialize(request: MCPRequest): MCPResponse {
    return {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
        },
        serverInfo: {
          name: 'enterprise-llm-orchestrator',
          version: '1.0.0',
        },
      },
    };
  }

  private handleToolsList(request: MCPRequest): MCPResponse {
    // Import manifest dynamically
    const manifest = {
      tools: [
        {
          name: "hr.getLeaveBalance",
          description: "Get leave balance for employeeId",
          inputSchema: {
            type: "object",
            properties: {
              employeeId: {
                type: "string",
                description: "Employee ID to lookup leave balance for"
              }
            },
            required: ["employeeId"]
          }
        },
        {
          name: "crm.lookupCustomer",
          description: "Look up customer by email",
          inputSchema: {
            type: "object",
            properties: {
              email: {
                type: "string",
                format: "email",
                description: "Customer email address to lookup"
              }
            },
            required: ["email"]
          }
        },
        {
          name: "banking.getPortfolioSummary",
          description: "Get portfolio summary by accountId",
          inputSchema: {
            type: "object",
            properties: {
              accountId: {
                type: "string",
                description: "Banking account ID to get portfolio summary for"
              }
            },
            required: ["accountId"]
          }
        }
      ]
    };

    return {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        tools: manifest.tools,
      },
    };
  }

  private async handleToolsCall(request: MCPRequest): Promise<MCPResponse> {
    const paramsSchema = z.object({
      name: z.string(),
      arguments: z.record(z.any()),
    });

    const params = paramsSchema.parse(request.params);
    const tool = getTool(params.name);

    if (!tool) {
      return this.createErrorResponse(request.id, -32602, `Tool '${params.name}' not found`);
    }

    const startTime = Date.now();
    
    try {
      const result = await tool.handler(params.arguments);
      const durationMs = Date.now() - startTime;

      logger.info(`MCP tool call: ${params.name}`, {
        durationMs,
        input: params.arguments,
        output: result,
      });

      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result),
            },
          ],
          isError: false,
        },
      };
    } catch (error) {
      const durationMs = Date.now() - startTime;
      logger.error(`MCP tool call failed: ${params.name}`, {
        durationMs,
        input: params.arguments,
        error,
      });

      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        },
      };
    }
  }

  private createErrorResponse(
    id: string | number,
    code: number,
    message: string,
    data?: any
  ): MCPResponse {
    return {
      jsonrpc: '2.0',
      id,
      error: {
        code,
        message,
        data,
      },
    };
  }

  async startStdio(): Promise<void> {
    if (!this.isStdioMode) return;

    logger.info('Starting MCP server in stdio mode');

    process.stdin.on('data', async (data) => {
      try {
        const lines = data.toString().split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          const request: MCPRequest = JSON.parse(line);
          const response = await this.handleRequest(request);
          console.log(JSON.stringify(response));
        }
      } catch (error) {
        logger.error('Error processing stdio input:', error);
      }
    });

    process.stdin.resume();
  }
}

// Standalone tool calling function for LangChain integration
export async function callMcpTool(
  toolName: string,
  input: Record<string, any>
): Promise<MCPToolResult> {
  const tool = getTool(toolName);
  
  if (!tool) {
    throw new Error(`Tool '${toolName}' not found`);
  }

  const startTime = Date.now();
  
  try {
    const result = await tool.handler(input);
    const durationMs = Date.now() - startTime;

    logger.info(`Direct MCP tool call: ${toolName}`, {
      durationMs,
      input,
      output: result,
    });

    return {
      content: [result],
      isError: false,
    };
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logger.error(`Direct MCP tool call failed: ${toolName}`, {
      durationMs,
      input,
      error,
    });

    throw error;
  }
}
