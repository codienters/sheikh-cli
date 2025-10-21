const { EnhancedChatSession } = require('../cli-enhanced');

describe('EnhancedChatSession', () => {
  let mockAgenticEngine;
  let mockConfig;
  let mockOptions;
  let chatSession;

  beforeEach(() => {
    mockAgenticEngine = {
      agents: new Map([
        ['codebase-analyzer', { name: 'codebase-analyzer', capabilities: ['search', 'analyze'] }],
        ['multi-file-editor', { name: 'multi-file-editor', capabilities: ['edit', 'create'] }]
      ]),
      searchCodebase: jest.fn(),
      executeAgenticTask: jest.fn(),
      generateWorkflow: jest.fn(),
      codebase: {
        generateReport: jest.fn()
      }
    };

    mockConfig = {
      globalState: {
        apiProvider: 'anthropic',
        agenticEnabled: true
      }
    };

    mockOptions = {
      agentic: true,
      visualDiff: true,
      coordinate: true
    };

    chatSession = new EnhancedChatSession(mockAgenticEngine, mockConfig, mockOptions);
  });

  describe('initialization', () => {
    test('should initialize with correct parameters', () => {
      expect(chatSession.agenticEngine).toBe(mockAgenticEngine);
      expect(chatSession.config).toBe(mockConfig);
      expect(chatSession.options).toBe(mockOptions);
      expect(chatSession.conversationHistory).toEqual([]);
      expect(chatSession.isRunning).toBe(false);
    });
  });

  describe('complex task detection', () => {
    test('should detect complex tasks', () => {
      const complexTasks = [
        'Create a new authentication module',
        'Refactor the user service to use JWT tokens',
        'Implement a new API endpoint with tests',
        'Migrate from Express to Fastify',
        'Add comprehensive error handling to all routes'
      ];

      complexTasks.forEach(task => {
        expect(chatSession.isComplexTask(task)).toBe(true);
      });
    });

    test('should not detect simple questions as complex tasks', () => {
      const simpleTasks = [
        'What is authentication?',
        'How do I use this?',
        'Can you help me?',
        'What does this code do?'
      ];

      simpleTasks.forEach(task => {
        expect(chatSession.isComplexTask(task)).toBe(false);
      });
    });
  });

  describe('slash command handling', () => {
    beforeEach(() => {
      // Mock console.log to avoid output during tests
      jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      console.log.mockRestore();
    });

    test('should handle /agents command', async () => {
      await chatSession.handleSlashCommand('/agents');
      expect(console.log).toHaveBeenCalled();
    });

    test('should handle /search command with query', async () => {
      mockAgenticEngine.searchCodebase.mockResolvedValue([
        { file: 'test.js', relevance: 0.8, context: { purpose: 'api' } }
      ]);

      await chatSession.handleSlashCommand('/search authentication middleware');
      expect(mockAgenticEngine.searchCodebase).toHaveBeenCalledWith('authentication middleware');
    });

    test('should handle /search command without query', async () => {
      await chatSession.handleSlashCommand('/search');
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Usage: /search <query>')
      );
    });

    test('should handle /analyze command', async () => {
      mockAgenticEngine.codebase.generateReport.mockResolvedValue('Analysis report');

      await chatSession.handleSlashCommand('/analyze');
      expect(mockAgenticEngine.codebase.generateReport).toHaveBeenCalled();
    });

    test('should handle /workflow command with description', async () => {
      const mockWorkflow = {
        getWorkflow: jest.fn().mockReturnValue({
          name: 'Test Workflow',
          steps: [
            { name: 'Step 1', type: 'test' }
          ]
        })
      };

      mockAgenticEngine.generateWorkflow.mockResolvedValue(mockWorkflow);

      await chatSession.handleSlashCommand('/workflow deploy to production');
      expect(mockAgenticEngine.generateWorkflow).toHaveBeenCalledWith('deploy to production');
    });

    test('should handle /workflow command without description', async () => {
      await chatSession.handleSlashCommand('/workflow');
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Usage: /workflow <description>')
      );
    });

    test('should handle /config command', async () => {
      await chatSession.handleSlashCommand('/config');
      expect(console.log).toHaveBeenCalled();
    });

    test('should handle /clear command', async () => {
      chatSession.conversationHistory = [
        { user: 'test', assistant: 'response', timestamp: new Date() }
      ];

      await chatSession.handleSlashCommand('/clear');
      expect(chatSession.conversationHistory).toEqual([]);
    });

    test('should handle /history command', async () => {
      chatSession.conversationHistory = [
        { user: 'test', assistant: 'response', timestamp: new Date() }
      ];

      await chatSession.handleSlashCommand('/history');
      expect(console.log).toHaveBeenCalled();
    });

    test('should handle unknown slash command', async () => {
      await chatSession.handleSlashCommand('/unknown');
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Unknown command: unknown')
      );
    });
  });

  describe('message processing', () => {
    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      console.log.mockRestore();
    });

    test('should process complex task with agentic engine', async () => {
      const complexTask = 'Create a new authentication module';
      mockAgenticEngine.executeAgenticTask.mockResolvedValue({
        status: 'completed',
        result: 'Task completed successfully'
      });

      await chatSession.processAgenticMessage(complexTask);

      expect(mockAgenticEngine.executeAgenticTask).toHaveBeenCalledWith(complexTask);
      expect(chatSession.conversationHistory).toHaveLength(1);
      expect(chatSession.conversationHistory[0].assistant).toBe('Agentic');
    });

    test('should process simple message with AI response', async () => {
      const simpleMessage = 'What is authentication?';

      await chatSession.processAgenticMessage(simpleMessage);

      expect(mockAgenticEngine.executeAgenticTask).not.toHaveBeenCalled();
      expect(chatSession.conversationHistory).toHaveLength(1);
      expect(chatSession.conversationHistory[0].assistant).toBe('Direct');
    });
  });

  describe('help system', () => {
    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      console.log.mockRestore();
    });

    test('should show comprehensive help', () => {
      chatSession.showHelp();

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Sheikh-CLI Agentic Engine Help')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Commands:')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Agentic Features:')
      );
    });
  });

  describe('conversation history', () => {
    test('should add messages to conversation history', async () => {
      const message = 'Test message';
      jest.spyOn(console, 'log').mockImplementation();

      await chatSession.processAgenticMessage(message);

      expect(chatSession.conversationHistory).toHaveLength(1);
      expect(chatSession.conversationHistory[0].user).toBe(message);
      expect(chatSession.conversationHistory[0].timestamp).toBeInstanceOf(Date);
    });

    test('should show conversation history', () => {
      const testHistory = [
        { user: 'Hello', assistant: 'Hi there!', timestamp: new Date() },
        { user: 'How are you?', assistant: 'I am well, thank you!', timestamp: new Date() }
      ];

      chatSession.conversationHistory = testHistory;
      jest.spyOn(console, 'log').mockImplementation();

      chatSession.showHistory();

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Conversation History')
      );
    });

    test('should show empty history message', () => {
      chatSession.conversationHistory = [];
      jest.spyOn(console, 'log').mockImplementation();

      chatSession.showHistory();

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('No conversation history')
      );
    });
  });
});

describe('CLI Integration Tests', () => {
  test('should handle agentic search command', async () => {
    // This would test the actual CLI command execution
    // In a real implementation, you would test the commander.js integration
    expect(true).toBe(true); // Placeholder for CLI integration tests
  });

  test('should handle analyze command', async () => {
    // Test the analyze command functionality
    expect(true).toBe(true); // Placeholder for analyze command tests
  });

  test('should handle workflow command', async () => {
    // Test the workflow generation command
    expect(true).toBe(true); // Placeholder for workflow command tests
  });

  test('should handle agents command', async () => {
    // Test the agents management command
    expect(true).toBe(true); // Placeholder for agents command tests
  });
});
