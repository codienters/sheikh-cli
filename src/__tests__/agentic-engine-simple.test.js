const { AgenticEngine, CodebaseAnalyzer, AgentCoordinator, ApprovalSystem } = require('../core/agentic-engine');

describe('AgenticEngine - Simple Tests', () => {
  let agenticEngine;
  let mockConfig;

  beforeEach(() => {
    mockConfig = {
      globalState: {
        apiProvider: 'anthropic',
        apiModelId: 'claude-3-5-sonnet-20241022',
        agenticEnabled: true
      },
      settings: {
        'agentic.visualDiff': true,
        'agentic.coordinateChanges': true
      }
    };
    
    agenticEngine = new AgenticEngine(mockConfig);
  });

  describe('initialization', () => {
    test('should initialize with correct configuration', () => {
      expect(agenticEngine.config).toEqual(mockConfig);
      expect(agenticEngine.agents).toBeDefined();
      expect(agenticEngine.workflows).toBeDefined();
      expect(agenticEngine.codebase).toBeDefined();
      expect(agenticEngine.coordinator).toBeDefined();
      expect(agenticEngine.approval).toBeDefined();
    });

    test('should load agents on initialization', async () => {
      await agenticEngine.initialize();
      
      expect(agenticEngine.agents.size).toBeGreaterThan(0);
      expect(agenticEngine.agents.has('codebase-analyzer')).toBe(true);
      expect(agenticEngine.agents.has('multi-file-editor')).toBe(true);
      expect(agenticEngine.agents.has('test-coordinator')).toBe(true);
    });

    test('should load workflows on initialization', async () => {
      await agenticEngine.initialize();
      
      expect(agenticEngine.workflows.size).toBeGreaterThan(0);
      expect(agenticEngine.workflows.has('deployment')).toBe(true);
      expect(agenticEngine.workflows.has('testing')).toBe(true);
    });
  });

  describe('agentic task execution', () => {
    test('should execute simple task', async () => {
      await agenticEngine.initialize();
      
      const task = 'Create a new authentication module';
      const result = await agenticEngine.executeAgenticTask(task);
      
      expect(result).toBeDefined();
      expect(result.planId).toBeDefined();
      expect(result.status).toBeDefined();
    });

    test('should handle complex multi-step task', async () => {
      await agenticEngine.initialize();
      
      const task = 'Refactor authentication system to use JWT tokens and update all related files';
      const result = await agenticEngine.executeAgenticTask(task);
      
      expect(result).toBeDefined();
      expect(result.steps).toBeDefined();
      expect(Array.isArray(result.steps)).toBe(true);
    });
  });

  describe('codebase search', () => {
    test('should search codebase with query', async () => {
      await agenticEngine.initialize();
      
      const query = 'authentication middleware';
      const results = await agenticEngine.searchCodebase(query);
      
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('workflow generation', () => {
    test('should generate workflow from description', async () => {
      await agenticEngine.initialize();
      
      const description = 'Deploy to production with automated testing';
      const workflow = await agenticEngine.generateWorkflow(description);
      
      expect(workflow).toBeDefined();
      expect(workflow.getWorkflow).toBeDefined();
      
      const workflowData = workflow.getWorkflow();
      expect(workflowData).toHaveProperty('name');
      expect(workflowData).toHaveProperty('steps');
      expect(Array.isArray(workflowData.steps)).toBe(true);
    });
  });
});

describe('CodebaseAnalyzer - Simple Tests', () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new CodebaseAnalyzer();
  });

  describe('file analysis', () => {
    test('should analyze file content without file system', async () => {
      const filePath = 'test.js';
      const content = `
        function authenticateUser(token) {
          return jwt.verify(token, secret);
        }
        
        class UserService {
          constructor() {
            this.db = new Database();
          }
        }
      `;
      
      const analysis = await analyzer.analyzeFile(filePath, content);
      
      expect(analysis).toHaveProperty('path', filePath);
      expect(analysis).toHaveProperty('type', 'javascript');
      expect(analysis).toHaveProperty('complexity');
      expect(analysis).toHaveProperty('dependencies');
      expect(analysis).toHaveProperty('patterns');
      expect(analysis).toHaveProperty('context');
    });

    test('should calculate file complexity', async () => {
      const simpleContent = 'console.log("hello");';
      const complexContent = `
        function complexFunction() {
          if (condition1) {
            for (let i = 0; i < 10; i++) {
              if (condition2) {
                return processData();
              }
            }
          }
        }
      `;
      
      const simpleAnalysis = await analyzer.analyzeFile('simple.js', simpleContent);
      const complexAnalysis = await analyzer.analyzeFile('complex.js', complexContent);
      
      expect(complexAnalysis.complexity).toBeGreaterThan(simpleAnalysis.complexity);
    });

    test('should extract dependencies', async () => {
      const content = `
        const express = require('express');
        import { UserService } from './services/user';
        import jwt from 'jsonwebtoken';
      `;
      
      const analysis = await analyzer.analyzeFile('test.js', content);
      
      expect(analysis.dependencies).toContain('express');
      expect(analysis.dependencies).toContain('./services/user');
      expect(analysis.dependencies).toContain('jsonwebtoken');
    });

    test('should identify file purpose', async () => {
      const testContent = `
        describe('UserService', () => {
          it('should authenticate user', () => {
            expect(userService.authenticate('token')).toBe(true);
          });
        });
      `;
      
      const analysis = await analyzer.analyzeFile('user.test.js', testContent);
      
      expect(analysis.context.purpose).toBe('testing');
    });
  });

  describe('search functionality', () => {
    test('should calculate relevance score', async () => {
      const analysis = {
        path: 'src/auth/middleware.js',
        context: {
          purpose: 'api',
          keyTerms: ['authentication', 'middleware', 'jwt', 'token']
        },
        dependencies: ['express', 'jsonwebtoken']
      };
      
      const query = 'authentication middleware';
      const relevance = await analyzer.calculateRelevance(query, analysis);
      
      expect(relevance).toBeGreaterThan(0);
      expect(relevance).toBeLessThanOrEqual(1);
    });

    test('should return higher relevance for exact matches', async () => {
      const exactMatch = {
        path: 'src/auth/middleware.js',
        context: {
          purpose: 'api',
          keyTerms: ['authentication', 'middleware']
        },
        dependencies: []
      };
      
      const partialMatch = {
        path: 'src/utils/helpers.js',
        context: {
          purpose: 'general',
          keyTerms: ['helper', 'utility']
        },
        dependencies: []
      };
      
      const query = 'authentication middleware';
      
      const exactRelevance = await analyzer.calculateRelevance(query, exactMatch);
      const partialRelevance = await analyzer.calculateRelevance(query, partialMatch);
      
      expect(exactRelevance).toBeGreaterThan(partialRelevance);
    });
  });

  describe('report generation', () => {
    test('should generate report', async () => {
      // Add some mock data to the analyzer
      analyzer.index.set('test.js', {
        path: 'test.js',
        type: 'javascript',
        size: 100,
        complexity: 2.5,
        dependencies: ['express'],
        patterns: { functions: 2, classes: 1 },
        context: { purpose: 'api', keyTerms: ['test', 'api'] }
      });

      const report = await analyzer.generateReport();
      
      expect(typeof report).toBe('string');
      expect(report).toContain('# Codebase Analysis Report');
      expect(report).toContain('## Summary');
    });
  });
});

describe('AgentCoordinator - Simple Tests', () => {
  let coordinator;

  beforeEach(() => {
    coordinator = new AgentCoordinator();
  });

  describe('plan creation', () => {
    test('should create execution plan', async () => {
      const task = 'Create authentication module with tests';
      const plan = await coordinator.createPlan(task);
      
      expect(plan).toHaveProperty('id');
      expect(plan).toHaveProperty('task', task);
      expect(plan).toHaveProperty('steps');
      expect(plan).toHaveProperty('dependencies');
      expect(plan).toHaveProperty('estimatedTime');
      expect(plan).toHaveProperty('risk');
      expect(Array.isArray(plan.steps)).toBe(true);
    });

    test('should analyze requirements correctly', async () => {
      const task = 'Create new user authentication system with JWT tokens and write comprehensive tests';
      const requirements = await coordinator.analyzeRequirements(task);
      
      expect(requirements).toHaveProperty('fileOperations');
      expect(requirements).toHaveProperty('testing');
      expect(requirements).toHaveProperty('gitOperations');
      expect(requirements).toHaveProperty('dependencies');
    });

    test('should generate appropriate steps', async () => {
      const requirements = {
        fileOperations: ['create', 'modify'],
        testing: true,
        gitOperations: ['commit']
      };
      
      const steps = await coordinator.generateSteps(requirements);
      
      expect(steps.length).toBeGreaterThan(0);
      expect(steps.some(step => step.agent === 'multi-file-editor')).toBe(true);
      expect(steps.some(step => step.agent === 'test-coordinator')).toBe(true);
      expect(steps.some(step => step.agent === 'git-workflow')).toBe(true);
    });
  });

  describe('plan execution', () => {
    test('should execute plan steps', async () => {
      const plan = {
        id: 'test-plan',
        task: 'Test task',
        steps: [
          {
            id: 'step1',
            action: 'Create file',
            agent: 'multi-file-editor',
            critical: true,
            estimatedTime: 30
          }
        ],
        dependencies: [],
        estimatedTime: 30,
        risk: 'low'
      };
      
      const results = await coordinator.executePlan(plan);
      
      expect(results).toHaveProperty('planId', plan.id);
      expect(results).toHaveProperty('status');
      expect(results).toHaveProperty('steps');
      expect(results).toHaveProperty('errors');
      expect(results).toHaveProperty('changes');
    });
  });

  describe('change coordination', () => {
    test('should coordinate changes across files', async () => {
      const changes = [
        {
          file: 'src/auth/middleware.js',
          type: 'modify',
          lines: '10-15'
        },
        {
          file: 'src/auth/routes.js',
          type: 'create',
          lines: '1-20'
        }
      ];
      
      const coordinated = await coordinator.coordinateChanges(changes);
      
      expect(coordinated).toHaveProperty('changes');
      expect(coordinated).toHaveProperty('conflicts');
      expect(coordinated).toHaveProperty('dependencies');
      expect(Array.isArray(coordinated.changes)).toBe(true);
      expect(Array.isArray(coordinated.conflicts)).toBe(true);
      expect(Array.isArray(coordinated.dependencies)).toBe(true);
    });
  });
});

describe('ApprovalSystem - Simple Tests', () => {
  let approvalSystem;

  beforeEach(() => {
    approvalSystem = new ApprovalSystem();
  });

  describe('approval creation', () => {
    test('should create approval for changes', async () => {
      const results = {
        planId: 'test-plan',
        changes: [
          {
            file: 'src/auth/middleware.js',
            type: 'modify',
            lines: '10-15'
          }
        ]
      };
      
      const approval = await approvalSystem.createApproval(results);
      
      expect(approval).toHaveProperty('id');
      expect(approval).toHaveProperty('timestamp');
      expect(approval).toHaveProperty('changes', results.changes);
      expect(approval).toHaveProperty('plan', results.planId);
      expect(approval).toHaveProperty('status', 'pending');
    });
  });

  describe('visual diff', () => {
    test('should show visual diff for changes', async () => {
      const approval = {
        id: 'test-approval',
        timestamp: new Date(),
        changes: [
          {
            file: 'src/auth/middleware.js',
            type: 'modify',
            lines: '10-15',
            content: '+ Added JWT verification\n- Removed session-based auth'
          }
        ],
        plan: 'test-plan',
        status: 'pending'
      };
      
      // Mock console.log to capture output
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      await approvalSystem.showVisualDiff(approval);
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

describe('Integration Tests - Simple', () => {
  let agenticEngine;

  beforeEach(() => {
    const mockConfig = {
      globalState: {
        apiProvider: 'anthropic',
        agenticEnabled: true
      }
    };
    
    agenticEngine = new AgenticEngine(mockConfig);
  });

  test('should handle end-to-end workflow', async () => {
    await agenticEngine.initialize();
    
    // Search codebase
    const searchResults = await agenticEngine.searchCodebase('authentication');
    
    // Execute agentic task
    const taskResults = await agenticEngine.executeAgenticTask('Create authentication module');
    
    // Generate workflow
    const workflow = await agenticEngine.generateWorkflow('Deploy with tests');
    
    expect(searchResults).toBeDefined();
    expect(taskResults).toBeDefined();
    expect(workflow).toBeDefined();
  });

  test('should coordinate multi-file changes', async () => {
    await agenticEngine.initialize();
    
    const changes = [
      { file: 'src/auth/middleware.js', type: 'modify' },
      { file: 'src/auth/routes.js', type: 'create' },
      { file: 'src/auth/tests.js', type: 'create' }
    ];
    
    const coordinated = await agenticEngine.coordinateChanges(changes);
    
    expect(coordinated).toBeDefined();
    expect(coordinated.changes).toBeDefined();
    expect(coordinated.conflicts).toBeDefined();
    expect(coordinated.dependencies).toBeDefined();
  });
});
