export interface Tool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

export interface ToolCall {
  id: string;
  toolName: string;
  input: Record<string, any>;
  output: Record<string, any>;
  durationMs: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
}

export interface ChatResponse {
  threadId: string;
  message: string;
  toolCalls: ToolCall[];
}

export interface HealthStatus {
  ok: boolean;
  timestamp: string;
  db: string;
  uptime: number;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
}

export interface ApiEndpoint {
  name: string;
  description: string;
  method: 'GET' | 'POST';
  path: string;
  requiresAuth: boolean;
  example?: string;
}

export type ToolCategory = 'hr' | 'crm' | 'banking';

export interface FlowStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}
