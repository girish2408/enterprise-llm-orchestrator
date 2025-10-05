import { getLeaveBalance } from './hr.js';
import { lookupCustomer } from './crm.js';
import { getPortfolioSummary } from './banking.js';

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: any;
  handler: (input: any) => Promise<any>;
}

export const toolRegistry: Record<string, ToolDefinition> = {
  'hr.getLeaveBalance': {
    name: 'hr.getLeaveBalance',
    description: 'Get leave balance for employeeId',
    inputSchema: {
      type: 'object',
      properties: {
        employeeId: {
          type: 'string',
          description: 'Employee ID to lookup leave balance for',
        },
      },
      required: ['employeeId'],
    },
    handler: getLeaveBalance,
  },
  'crm.lookupCustomer': {
    name: 'crm.lookupCustomer',
    description: 'Look up customer by email',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          description: 'Customer email address to lookup',
        },
      },
      required: ['email'],
    },
    handler: lookupCustomer,
  },
  'banking.getPortfolioSummary': {
    name: 'banking.getPortfolioSummary',
    description: 'Get portfolio summary by accountId',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: {
          type: 'string',
          description: 'Banking account ID to get portfolio summary for',
        },
      },
      required: ['accountId'],
    },
    handler: getPortfolioSummary,
  },
};

export function getTool(name: string): ToolDefinition | undefined {
  return toolRegistry[name];
}

export function getAllTools(): ToolDefinition[] {
  return Object.values(toolRegistry);
}

export function getToolNames(): string[] {
  return Object.keys(toolRegistry);
}
