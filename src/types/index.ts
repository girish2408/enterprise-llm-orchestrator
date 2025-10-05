export interface ChatRequest {
  threadId?: string;
  message: string;
}

export interface ChatResponse {
  threadId: string;
  message: string;
  toolCalls?: ToolInvocation[];
}

export interface ToolInvocation {
  id: string;
  toolName: string;
  input: Record<string, any>;
  output: Record<string, any>;
  durationMs?: number;
}

export interface MCPToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface MCPToolResult {
  content: any[];
  isError?: boolean;
}

// HR Tool Types
export interface LeaveBalanceRequest {
  employeeId: string;
}

export interface LeaveBalanceResponse {
  employeeId: string;
  annual: number;
  sick: number;
  remaining: number;
  error?: string;
}

// CRM Tool Types
export interface CustomerLookupRequest {
  email: string;
}

export interface CustomerLookupResponse {
  email: string;
  id: string;
  tier: string;
  lastOrder: {
    date: string;
    value: number;
  };
  error?: string;
}

// Banking Tool Types
export interface PortfolioSummaryRequest {
  accountId: string;
}

export interface PortfolioSummaryResponse {
  accountId: string;
  totalValue: number;
  pnlPct: number;
  topHoldings: Array<{
    symbol: string;
    weight: number;
  }>;
  error?: string;
}
