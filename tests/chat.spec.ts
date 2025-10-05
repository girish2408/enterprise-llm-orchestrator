import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createServer } from '../src/server.js';

// Mock the database and agent
vi.mock('../src/services/db.js', () => ({
  db: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    healthCheck: vi.fn().mockResolvedValue(true),
    client: {
      thread: {
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({ id: 'test-thread-id' }),
        update: vi.fn(),
      },
      message: {
        create: vi.fn().mockResolvedValue({ id: 'test-message-id' }),
        findMany: vi.fn().mockResolvedValue([]),
      },
    },
  },
}));

vi.mock('../src/langchain/agent.js', () => ({
  enterpriseAgent: {
    chat: vi.fn().mockResolvedValue({
      threadId: 'test-thread-id',
      response: 'Test response from agent',
      toolCalls: [],
    }),
    chatStream: vi.fn().mockImplementation(async function* () {
      yield 'Test ';
      yield 'streaming ';
      yield 'response';
    }),
  },
}));

describe('Chat API', () => {
  const app = createServer();

  describe('POST /chat', () => {
    it('should require API key authentication', async () => {
      const response = await request(app)
        .post('/chat')
        .send({ message: 'Test message' })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'API key required');
    });

    it('should accept valid chat request', async () => {
      const response = await request(app)
        .post('/chat')
        .set('x-api-key', 'test-api-key')
        .send({ message: 'Get leave balance for employee 1001' })
        .expect(200);

      expect(response.body).toHaveProperty('threadId');
      expect(response.body).toHaveProperty('message');
      expect(response.body.threadId).toBe('test-thread-id');
      expect(response.body.message).toBe('Test response from agent');
    });

    it('should validate request body', async () => {
      const response = await request(app)
        .post('/chat')
        .set('x-api-key', 'test-api-key')
        .send({ message: '' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation error');
    });

    it('should handle streaming requests', async () => {
      const response = await request(app)
        .post('/chat?stream=1')
        .set('x-api-key', 'test-api-key')
        .send({ message: 'Test streaming message' })
        .expect(200);

      expect(response.headers['content-type']).toContain('text/event-stream');
    });
  });

  describe('GET /tools', () => {
    it('should return available tools', async () => {
      const response = await request(app)
        .get('/tools')
        .set('x-api-key', 'test-api-key')
        .expect(200);

      expect(response.body).toHaveProperty('tools');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.tools)).toBe(true);
      expect(response.body.tools.length).toBeGreaterThan(0);
    });

    it('should require API key for tools endpoint', async () => {
      const response = await request(app)
        .get('/tools')
        .expect(401);

      expect(response.body).toHaveProperty('error', 'API key required');
    });
  });

  describe('GET /healthz', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/healthz')
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body).toHaveProperty('db', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });
});
