const fs = require('fs-extra');
const path = require('path');

jest.mock('fs-extra');
jest.mock('glob');

describe('Agents Tests', () => {
  let agents;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    
    // Set test environment
    process.env.NODE_ENV = 'test';

    // Mock fs operations
    fs.ensureDir.mockResolvedValue();
    fs.writeFile.mockResolvedValue();
    fs.unlink.mockResolvedValue();

    // Mock glob to return agent files
    const glob = require('glob');
    glob.sync.mockReturnValue([
      '.claude/agents/debugger.md',
      '.claude/agents/test-runner.md'
    ]);

    // Mock fs.readFile to return agent content
    fs.readFile.mockImplementation((filePath) => {
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

    agents = require('../src/agents/index.js');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should load agents from filesystem', async () => {
    await agents.loadAgents();
    const loadedAgents = agents.getAgents();

    expect(loadedAgents).toBeDefined();
    expect(Object.keys(loadedAgents).length).toBeGreaterThan(0);
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

    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('new-agent.md'),
      expect.stringContaining('---'),
      'utf-8'
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

    expect(fs.unlink).toHaveBeenCalledWith(
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