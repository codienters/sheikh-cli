const fs = require('fs-extra');
const path = require('path');

jest.mock('fs-extra');

describe('Config Tests', () => {
  let config;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    
    // Set test environment
    process.env.NODE_ENV = 'test';

    // Mock fs operations
    fs.pathExists.mockResolvedValue(true);
    fs.readJson.mockResolvedValue({
      apiProvider: 'anthropic',
      apiModelId: 'claude-3-5-sonnet-20241022'
    });
    fs.writeJson.mockResolvedValue();
    fs.ensureDir.mockResolvedValue();

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

    expect(fs.writeJson).toHaveBeenCalledWith(
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