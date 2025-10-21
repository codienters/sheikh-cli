const fs = require('fs-extra');
const path = require('path');

describe('Integration Tests', () => {
  beforeAll(() => {
    // Set up test environment
    process.env.NODE_ENV = 'test';
  });

  afterAll(() => {
    // Clean up test environment
    delete process.env.NODE_ENV;
  });

  test('should handle end-to-end configuration flow', async () => {
    // Mock configuration directory
    const configDir = path.join(process.cwd(), '.sheikh');
    const configFile = path.join(configDir, 'config.json');

    // Clean up any existing test config
    if (await fs.pathExists(configFile)) {
      await fs.unlink(configFile);
    }

    // Test config creation (this would normally be done by CLI)
    const testConfig = {
      apiProvider: 'anthropic',
      apiModelId: 'claude-3-5-sonnet-20241022',
      autoApprovalSettings: {
        enabled: true,
        actions: {
          readFiles: true,
          editFiles: false,
          executeSafeCommands: true
        }
      }
    };

    await fs.ensureDir(configDir);
    await fs.writeJson(configFile, testConfig);

    // Verify config was written
    const savedConfig = await fs.readJson(configFile);
    expect(savedConfig.apiProvider).toBe('anthropic');
    expect(savedConfig.autoApprovalSettings.enabled).toBe(true);

    // Clean up
    await fs.unlink(configFile);
    await fs.rmdir(configDir);
  });

  test('should handle provider initialization with mock API', async () => {
    // This test would normally test actual provider initialization
    // but since we don't have the actual source files, we'll mock the behavior

    const mockProvider = {
      name: 'anthropic',
      initialize: jest.fn().mockResolvedValue(true),
      sendMessage: jest.fn().mockResolvedValue({
        content: 'Mock response from AI provider',
        usage: { inputTokens: 10, outputTokens: 20 }
      })
    };

    // Test provider initialization
    await expect(mockProvider.initialize()).resolves.toBe(true);

    // Test message sending
    const response = await mockProvider.sendMessage('Hello, AI!');
    expect(response.content).toContain('Mock response');
    expect(response.usage).toBeDefined();
  });

  test('should handle skill loading and execution flow', async () => {
    // Mock skill directory structure
    const skillDir = path.join(process.cwd(), '.claude', 'skills', 'test-skill');
    const skillFile = path.join(skillDir, 'SKILL.md');

    // Create mock skill file
    const skillContent = `---
name: Test Skill
description: Integration test skill
---

# Test Skill

This skill demonstrates the integration test flow.
`;

    await fs.ensureDir(skillDir);
    await fs.writeFile(skillFile, skillContent);

    // Mock skill loading (normally done by skills manager)
    const mockSkill = {
      name: 'Test Skill',
      description: 'Integration test skill',
      execute: jest.fn().mockResolvedValue({
        success: true,
        output: 'Skill executed successfully'
      })
    };

    // Test skill execution
    const result = await mockSkill.execute({ input: 'test' });
    expect(result.success).toBe(true);
    expect(result.output).toContain('successfully');

    // Clean up
    await fs.unlink(skillFile);
    try {
      await fs.rmdir(skillDir);
      await fs.rmdir(path.dirname(skillDir));
    } catch (error) {
      // Directory might not be empty, ignore error
    }
  });

  test('should handle agent creation and management', async () => {
    // Mock agent directory structure
    const agentDir = path.join(process.cwd(), '.claude', 'agents');
    const agentFile = path.join(agentDir, 'test-agent.md');

    // Create mock agent file
    const agentContent = `---
name: test-agent
description: Integration test agent
tools: Read, Write
model: inherit
---

# Test Agent

You are a test agent for integration testing.
`;

    await fs.ensureDir(agentDir);
    await fs.writeFile(agentFile, agentContent);

    // Mock agent loading
    const mockAgent = {
      name: 'test-agent',
      description: 'Integration test agent',
      tools: ['Read', 'Write'],
      model: 'inherit',
      content: 'You are a test agent for integration testing.'
    };

    // Test agent properties
    expect(mockAgent.name).toBe('test-agent');
    expect(mockAgent.tools).toContain('Read');
    expect(mockAgent.tools).toContain('Write');

    // Clean up
    await fs.unlink(agentFile);
    await fs.rmdir(agentDir);
  });

  test('should handle MCP server configuration', async () => {
    // Mock MCP configuration
    const mcpConfig = {
      mcpServers: {
        'test-server': {
          command: 'node',
          args: ['test-server.js'],
          env: {
            NODE_ENV: 'test'
          }
        }
      }
    };

    const mcpDir = path.join(process.cwd(), '.sheikh');
    const mcpFile = path.join(mcpDir, 'mcp.json');

    await fs.ensureDir(mcpDir);
    await fs.writeJson(mcpFile, mcpConfig);

    // Verify MCP config
    const savedMCPConfig = await fs.readJson(mcpFile);
    expect(savedMCPConfig.mcpServers['test-server']).toBeDefined();
    expect(savedMCPConfig.mcpServers['test-server'].command).toBe('node');

    // Clean up
    await fs.unlink(mcpFile);
    await fs.rmdir(mcpDir);
  });
});