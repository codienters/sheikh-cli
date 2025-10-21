// Jest setup file
process.env.NODE_ENV = 'test';

// Mock environment variables for testing
process.env.API_KEY = 'test-anthropic-key';
process.env.OPENAI_API_KEY = 'test-openai-key';

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test utilities
global.testUtils = {
  mockProviderResponse: (data) => ({
    choices: [{ message: { content: JSON.stringify(data) } }]
  }),

  mockFileSystem: () => {
    jest.mock('fs-extra', () => ({
      readFile: jest.fn(),
      writeFile: jest.fn(),
      existsSync: jest.fn(),
      mkdirp: jest.fn(),
      readdir: jest.fn()
    }));
  }
};