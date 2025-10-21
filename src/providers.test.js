describe('Providers Tests', () => {
  let providers;

  beforeEach(() => {
    jest.resetModules();

    // Mock axios for HTTP requests
    jest.mock('axios');
    const axios = require('axios');
    axios.create.mockReturnValue({
      post: jest.fn().mockResolvedValue({
        data: {
          choices: [{ message: { content: 'Test response' } }]
        }
      })
    });

    providers = require('../src/providers/index.js');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize provider manager', () => {
    expect(providers).toBeDefined();
    expect(typeof providers.getProvider).toBe('function');
  });

  test('should get anthropic provider', () => {
    const provider = providers.getProvider('anthropic');
    expect(provider).toBeDefined();
    expect(provider.name).toBe('anthropic');
  });

  test('should get openai provider', () => {
    const provider = providers.getProvider('openai');
    expect(provider).toBeDefined();
    expect(provider.name).toBe('openai');
  });

  test('should get aws provider', () => {
    const provider = providers.getProvider('aws');
    expect(provider).toBeDefined();
    expect(provider.name).toBe('aws');
  });

  test('should get google provider', () => {
    const provider = providers.getProvider('google');
    expect(provider).toBeDefined();
    expect(provider.name).toBe('google');
  });

  test('should get ollama provider', () => {
    const provider = providers.getProvider('ollama');
    expect(provider).toBeDefined();
    expect(provider.name).toBe('ollama');
  });

  test('should throw error for invalid provider', () => {
    expect(() => providers.getProvider('invalid')).toThrow();
  });

  test('should list all available providers', () => {
    const availableProviders = providers.listProviders();
    expect(Array.isArray(availableProviders)).toBe(true);
    expect(availableProviders.length).toBeGreaterThan(0);
    expect(availableProviders).toContain('anthropic');
    expect(availableProviders).toContain('openai');
  });
});