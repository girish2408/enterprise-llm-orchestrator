import { Tool, ChatResponse, HealthStatus } from '../types';

const API_BASE = 'http://localhost:8080';
const API_KEY = 'test-api-key-12345';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getHealth(): Promise<HealthStatus> {
    return this.request<HealthStatus>('/healthz');
  }

  async getTools(): Promise<{ tools: Tool[]; count: number }> {
    return this.request<{ tools: Tool[]; count: number }>('/tools');
  }

  async sendMessage(message: string, threadId?: string): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, threadId }),
    });
  }

  async sendStreamingMessage(
    message: string,
    threadId: string | undefined,
    onChunk: (chunk: string) => void,
    onComplete: (response: ChatResponse) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/chat?stream=1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({ message, threadId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              // Streaming complete
              return;
            }
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                onChunk(parsed.content);
              }
            } catch (e) {
              // Ignore parsing errors for streaming chunks
            }
          }
        }
      }
    } catch (error) {
      onError(error as Error);
    }
  }
}

export const apiClient = new ApiClient();
