describe('CLI Tests', () => {
  let cli;

  beforeEach(() => {
    // Reset modules before each test
    jest.resetModules();

    // Mock process.argv for testing
    process.argv = ['node', 'src/cli.js'];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize commander program', () => {
    expect(() => {
      cli = require('../src/cli.js');
    }).not.toThrow();
  });

  test('should have chat command', () => {
    const cli = require('../src/cli.js');
    expect(cli.commands.some(cmd => cmd.name() === 'chat')).toBe(true);
  });

  test('should have config command', () => {
    const cli = require('../src/cli.js');
    expect(cli.commands.some(cmd => cmd.name() === 'config')).toBe(true);
  });

  test('should have agents command', () => {
    const cli = require('../src/cli.js');
    expect(cli.commands.some(cmd => cmd.name() === 'agents')).toBe(true);
  });

  test('should have skills command', () => {
    const cli = require('../src/cli.js');
    expect(cli.commands.some(cmd => cmd.name() === 'skills')).toBe(true);
  });
});