const path = require('path');

// Create mock functions
const mockEnsureDir = jest.fn();
const mockWriteFile = jest.fn();
const mockRemove = jest.fn();
const mockReadFile = jest.fn();

// Mock fs-extra before requiring the skills module
jest.doMock('fs-extra', () => ({
  ensureDir: mockEnsureDir,
  writeFile: mockWriteFile,
  remove: mockRemove,
  readFile: mockReadFile
}));

// Create mock functions for glob
const mockGlobSync = jest.fn();

jest.doMock('glob', () => ({
  sync: mockGlobSync
}));

const fs = require('fs-extra');

describe('Skills Tests', () => {
  let skills;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    
    // Set test environment
    process.env.NODE_ENV = 'test';

    // Mock fs operations
    mockEnsureDir.mockResolvedValue();
    mockWriteFile.mockResolvedValue();
    mockRemove.mockResolvedValue();

    // Mock glob to return skill files
    mockGlobSync.mockReturnValue([
      '.claude/skills/test-skill/SKILL.md',
      '.claude/skills/another-skill/SKILL.md',
      '.claude/skills/error-skill/SKILL.md'
    ]);

    // Mock fs.readFile to return skill content
    mockReadFile.mockImplementation((filePath) => {
      if (filePath.includes('test-skill')) {
        return Promise.resolve(`---
name: Test Skill
description: A test skill for unit testing
---

# Test Skill

This is a test skill for unit testing purposes.
`);
      } else if (filePath.includes('another-skill')) {
        return Promise.resolve(`---
name: Another Skill
description: Another test skill
---

# Another Skill

This is another test skill.
`);
      } else if (filePath.includes('error-skill')) {
        return Promise.resolve(`---
name: Error Skill
description: A skill that throws errors for testing
---

# Error Skill

This skill intentionally throws errors for testing error handling.
`);
      }
      return Promise.resolve('');
    });

    // Clear module cache and require fresh
    delete require.cache[require.resolve('../src/skills/index.js')];
    skills = require('../src/skills/index.js');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should load skills from filesystem', async () => {
    await skills.loadSkills();
    const loadedSkills = skills.getSkills();

    expect(loadedSkills).toBeDefined();
    expect(loadedSkills.size).toBeGreaterThan(0);
  });

  test('should get skill by name', async () => {
    await skills.loadSkills();
    const skill = skills.getSkill('Test Skill');

    expect(skill).toBeDefined();
    expect(skill.name).toBe('Test Skill');
    expect(skill.description).toBe('A test skill for unit testing');
  });

  test('should return null for non-existent skill', async () => {
    await skills.loadSkills();
    const skill = skills.getSkill('non-existent-skill');

    expect(skill).toBeNull();
  });

  test('should list all skill names', async () => {
    await skills.loadSkills();
    const skillNames = skills.listSkills();

    expect(Array.isArray(skillNames)).toBe(true);
    expect(skillNames.length).toBeGreaterThan(0);
    expect(skillNames).toContain('Test Skill');
    expect(skillNames).toContain('Another Skill');
  });

  test('should execute skill with context', async () => {
    await skills.loadSkills();

    const context = {
      input: 'test input',
      workspace: '/test/workspace'
    };

    const result = await skills.executeSkill('Test Skill', context);

    // Since execution depends on actual skill implementation,
    // we just verify the method exists and can be called
    expect(typeof result).toBe('object');
    expect(result.success).toBe(true);
  });

  test('should handle skill execution errors', async () => {
    await skills.loadSkills();

    await expect(skills.executeSkill('Error Skill', {}))
      .rejects
      .toThrow('Failed to execute skill \'Error Skill\': Skill execution failed');
  });
});