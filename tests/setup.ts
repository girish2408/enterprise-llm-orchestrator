import { beforeAll, afterAll } from 'vitest';

// Mock environment variables for tests
process.env.NODE_ENV = 'test';
process.env.API_KEY = 'test-api-key';
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

beforeAll(async () => {
  // Setup test database if needed
});

afterAll(async () => {
  // Cleanup test database if needed
});
