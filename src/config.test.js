const path = require('path');

// Create mock functions
const mockPathExists = jest.fn();
const mockReadJson = jest.fn();
const mockWriteJson = jest.fn();
const mockEnsureDir = jest.fn();

// Mock fs-extra before requiring the config module
jest.doMock('fs-extra', () => ({
  pathExists: mockPathExists,
  readJson: mockReadJson,
  writeJson: mockWriteJson,
  ensureDir: mockEnsureDir
}));

const fs = require('fs-extra');

describe('Config Tests', () => {
  let config;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    
    // Set test environment
    process.env.NODE_ENV = 'test';

    // Mock fs operations
    mockPathExists.mockResolvedValue(true);
    mockReadJson.mockResolvedValue({
      apiProvider: 'anthropic',
      apiModelId: 'claude-3-5-sonnet-20241022'
    });
    mockWriteJson.mockResolvedValue();
    mockEnsureDir.mockResolvedValue();

    // Clear module cache and require fresh
    delete require.cache[require.resolve('../src/config.js')];
    config = require('../src/config.js');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should load configuration from file', async () => {
    const configData = await config.loadConfig();
    expect(configData).toBeDefined();
    expect(configData.apiProvider).toBe('anthropic');
  });

  test('should save configuration to file', async () => {
    const configData = {
      apiProvider: 'openai',
      apiModelId: 'gpt-4'
    };

    await config.saveConfig(configData);

    expect(mockWriteJson).toHaveBeenCalledWith(
      expect.stringContaining('config.json'),
      configData,
      { spaces: 2 }
    );
  });

  test('should validate configuration', () => {
    const validConfig = {
      apiProvider: 'anthropic',
      apiModelId: 'claude-3-5-sonnet-20241022',
      autoApprovalSettings: {
        enabled: true,
        actions: {
          readFiles: true,
          editFiles: false
        }
      }
    };

    const result = config.validateConfig(validConfig);
    expect(result.valid).toBe(true);
  });

  test('should return validation error for invalid provider', () => {
    const invalidConfig = {
      apiProvider: 'invalid-provider'
    };

    const result = config.validateConfig(invalidConfig);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid API provider');
  });

  test('should get default configuration', () => {
    const defaultConfig = config.getDefaultConfig();
    expect(defaultConfig).toHaveProperty('apiProvider');
    expect(defaultConfig).toHaveProperty('autoApprovalSettings');
  });
});