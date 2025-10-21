const path = require('path');

// Create mock functions
const mockEnsureDir = jest.fn();
const mockWriteFile = jest.fn();
const mockUnlink = jest.fn();
const mockReadFile = jest.fn();

// Mock fs-extra before requiring the agents module
jest.doMock('fs-extra', () => ({
  ensureDir: mockEnsureDir,
  writeFile: mockWriteFile,
  unlink: mockUnlink,
  readFile: mockReadFile
}));

// Create mock functions for glob
const mockGlobSync = jest.fn();

jest.doMock('glob', () => ({
  sync: mockGlobSync
}));

const fs = require('fs-extra');

describe('Agents Tests', () => {
  let agents;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    
    // Set test environment
    process.env.NODE_ENV = 'test';

    // Mock fs operations
    mockEnsureDir.mockResolvedValue();
    mockWriteFile.mockResolvedValue();
    mockUnlink.mockResolvedValue();

    // Mock glob to return agent files
    mockGlobSync.mockReturnValue([
      '.claude/agents/debugger.md',
      '.claude/agents/test-runner.md'
    ]);

    // Mock fs.readFile to return agent content
    mockReadFile.mockImplementation((filePath) => {
      if (filePath.includes('debugger.md')) {
        return Promise.resolve(`---
name: debugger
description: Debugging specialist
tools: Read, Edit, Bash
model: inherit
---

# Debugger Agent

You are an expert debugging specialist.
`);
      } else if (filePath.includes('test-runner.md')) {
        return Promise.resolve(`---
name: test-runner
description: Test automation expert
tools: Bash, Read, Edit
model: inherit
---

# Test Runner Agent

You are an expert in test automation.
`);
      }
      return Promise.resolve('');
    });

    // Clear module cache and require fresh
    delete require.cache[require.resolve('../src/agents/index.js')];
    agents = require('../src/agents/index.js');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should load agents from filesystem', async () => {
    await agents.loadAgents();
    const loadedAgents = agents.getAgents();

    expect(loadedAgents).toBeDefined();
    expect(loadedAgents.size).toBeGreaterThan(0);
  });

  test('should get agent by name', async () => {
    await agents.loadAgents();
    const agent = agents.getAgent('debugger');

    expect(agent).toBeDefined();
    expect(agent.name).toBe('debugger');
    expect(agent.description).toBe('Debugging specialist');
    expect(agent.tools).toContain('Read');
  });

  test('should return null for non-existent agent', async () => {
    await agents.loadAgents();
    const agent = agents.getAgent('non-existent-agent');

    expect(agent).toBeNull();
  });

  test('should list all agent names', async () => {
    await agents.loadAgents();
    const agentNames = agents.listAgents();

    expect(Array.isArray(agentNames)).toBe(true);
    expect(agentNames.length).toBeGreaterThan(0);
    expect(agentNames).toContain('debugger');
    expect(agentNames).toContain('test-runner');
  });

  test('should validate agent configuration', () => {
    const validAgent = {
      name: 'test-agent',
      description: 'Test agent',
      tools: ['Read', 'Write'],
      model: 'inherit'
    };

    const result = agents.validateAgent(validAgent);
    expect(result.valid).toBe(true);
  });

  test('should return validation error for invalid agent configuration', () => {
    const invalidAgent = {
      name: '',
      tools: []
    };

    const result = agents.validateAgent(invalidAgent);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Agent name is required');
  });

  test('should create new agent', async () => {
    const agentData = {
      name: 'new-agent',
      description: 'A new test agent',
      tools: ['Read', 'Bash'],
      model: 'inherit',
      content: 'You are a helpful agent.'
    };

    await agents.createAgent(agentData);

    expect(mockWriteFile).toHaveBeenCalledWith(
      expect.stringContaining('new-agent.md'),
      expect.stringContaining('---'),
      'utf8'
    );
  });

  test('should delete agent', async () => {
    // First create a mock agent
    const mockAgent = {
      name: 'debugger',
      filePath: '.claude/agents/debugger.md'
    };
    
    // Mock getAgent to return the mock agent
    agents.getAgent = jest.fn().mockReturnValue(mockAgent);

    await agents.deleteAgent('debugger');

    expect(mockUnlink).toHaveBeenCalledWith(
      expect.stringContaining('debugger.md')
    );
  });

  test('should handle agent deletion of non-existent agent', async () => {
    // Mock getAgent to return null
    agents.getAgent = jest.fn().mockReturnValue(null);

    await expect(agents.deleteAgent('non-existent'))
      .rejects
      .toThrow('Agent \'non-existent\' not found');
  });
});