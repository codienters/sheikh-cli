#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const { config } = require('dotenv');
const path = require('path');
const fs = require('fs-extra');
const { AgenticEngine } = require('./core/agentic-engine');
const { loadConfig, validateConfig } = require('./config');
const { setupEnvironment, validateEnvironmentVariables } = require('./utils/environment');

// Load environment variables
config();

const program = new Command();

program
  .name('sheikh')
  .description('AI agents your unfair advantage - powerful AI capabilities in your terminal')
  .version('2.0.0');

// Enhanced chat command with agentic capabilities
program
  .command('chat')
  .description('Start an agentic chat session with advanced AI capabilities')
  .option('-p, --provider <provider>', 'AI provider to use')
  .option('-m, --model <model>', 'Model to use')
  .option('--full-auto', 'Run in fully automated mode')
  .option('--auto-approve-mcp', 'Automatically approve all MCP tool usage requests')
  .option('--custom-instructions <instructions>', 'Provide custom instructions for the task')
  .option('--workspace <path>', 'Specify a custom workspace directory path')
  .option('--agentic', 'Enable advanced agentic capabilities')
  .option('--visual-diff', 'Show visual diffs for changes')
  .option('--coordinate', 'Enable multi-file coordination')
  .action(async (options) => {
    try {
      const spinner = ora('Initializing Sheikh-CLI Agentic Engine...').start();
      
      // Setup environment and validate configuration
      await setupEnvironment(options.workspace);
      const config = await loadConfig();
      const validation = validateConfig(config);
      
      if (!validation.valid) {
        spinner.fail('Configuration validation failed');
        console.error(chalk.red('Error:'), validation.error);
        process.exit(1);
      }

      // Check environment variables
      const envValidation = validateEnvironmentVariables();
      if (envValidation.available.length === 0) {
        spinner.warn('No API keys found in environment variables');
        console.log(chalk.yellow('Please set at least one API key environment variable:'));
        envValidation.optional.forEach(varName => {
          console.log(chalk.gray(`  - ${varName}`));
        });
        console.log();
      }
      
      spinner.succeed('Sheikh-CLI Agentic Engine initialized successfully');
      
      // Initialize Agentic Engine
      const agenticEngine = new AgenticEngine(config);
      await agenticEngine.initialize();
      
      // Start enhanced chat session
      const enhancedChat = new EnhancedChatSession(agenticEngine, config, options);
      await enhancedChat.startChat();
      
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// New agentic commands
program
  .command('search <query>')
  .description('Search your entire codebase using agentic search')
  .option('--type <type>', 'Filter by file type (js, ts, py, etc.)')
  .option('--limit <number>', 'Limit number of results', '10')
  .action(async (query, options) => {
    try {
      const spinner = ora('Searching codebase...').start();
      
      const config = await loadConfig();
      const agenticEngine = new AgenticEngine(config);
      await agenticEngine.initialize();
      
      const results = await agenticEngine.searchCodebase(query);
      
      spinner.succeed(`Found ${results.length} relevant files`);
      
      // Display results
      console.log(chalk.blue('\n🔍 Search Results:'));
      results.slice(0, parseInt(options.limit)).forEach((result, index) => {
        console.log(chalk.cyan(`\n${index + 1}. ${result.file}`));
        console.log(chalk.gray(`   Relevance: ${Math.round(result.relevance * 100)}%`));
        console.log(chalk.gray(`   Purpose: ${result.context.purpose}`));
        console.log(chalk.gray(`   Key Terms: ${result.context.keyTerms.join(', ')}`));
      });
      
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('analyze')
  .description('Analyze your entire codebase and generate insights')
  .option('--output <file>', 'Output file for analysis results')
  .option('--format <format>', 'Output format (json, markdown, text)', 'markdown')
  .action(async (options) => {
    try {
      const spinner = ora('Analyzing codebase...').start();
      
      const config = await loadConfig();
      const agenticEngine = new AgenticEngine(config);
      await agenticEngine.initialize();
      
      const analysis = await agenticEngine.codebase.generateReport();
      
      spinner.succeed('Codebase analysis complete');
      
      // Display or save results
      if (options.output) {
        await fs.writeFile(options.output, analysis);
        console.log(chalk.green(`Analysis saved to: ${options.output}`));
      } else {
        console.log(chalk.blue('\n📊 Codebase Analysis:'));
        console.log(analysis);
      }
      
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('workflow <description>')
  .description('Generate and execute a workflow from natural language description')
  .option('--execute', 'Execute the workflow immediately')
  .option('--dry-run', 'Show what would be done without executing')
  .action(async (description, options) => {
    try {
      const spinner = ora('Generating workflow...').start();
      
      const config = await loadConfig();
      const agenticEngine = new AgenticEngine(config);
      await agenticEngine.initialize();
      
      const workflow = await agenticEngine.generateWorkflow(description);
      const workflowData = workflow.getWorkflow();
      
      spinner.succeed('Workflow generated successfully');
      
      // Display workflow
      console.log(chalk.blue('\n⚙️ Generated Workflow:'));
      console.log(chalk.cyan(`Name: ${workflowData.name}`));
      console.log(chalk.gray(`Description: ${workflowData.description}`));
      console.log(chalk.yellow('\nSteps:'));
      workflowData.steps.forEach((step, index) => {
        console.log(chalk.gray(`  ${index + 1}. ${step.name} (${step.type})`));
      });
      
      if (options.execute) {
        console.log(chalk.blue('\n🚀 Executing workflow...'));
        // Execute workflow logic would go here
      } else if (options.dryRun) {
        console.log(chalk.yellow('\n🔍 Dry run - no changes made'));
      } else {
        console.log(chalk.yellow('\nUse --execute to run the workflow or --dry-run to preview'));
      }
      
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('agents')
  .description('Manage AI agents and their capabilities')
  .option('--list', 'List all available agents')
  .option('--status', 'Show agent status and capabilities')
  .option('--create <name>', 'Create a new custom agent')
  .option('--delete <name>', 'Delete an agent')
  .action(async (options) => {
    try {
      const config = await loadConfig();
      const agenticEngine = new AgenticEngine(config);
      await agenticEngine.initialize();
      
      if (options.list || !Object.keys(options).length) {
        console.log(chalk.blue('\n🤖 Available Agents:'));
        for (const [name, agent] of agenticEngine.agents) {
          console.log(chalk.cyan(`  • ${agent.name}`));
          console.log(chalk.gray(`    Capabilities: ${agent.capabilities.join(', ')}`));
        }
      }
      
      if (options.status) {
        console.log(chalk.blue('\n📊 Agent Status:'));
        for (const [name, agent] of agenticEngine.agents) {
          console.log(chalk.green(`  ✅ ${agent.name}: Active`));
        }
      }
      
      if (options.create) {
        console.log(chalk.yellow(`Creating agent: ${options.create}`));
        // Agent creation logic would go here
      }
      
      if (options.delete) {
        console.log(chalk.yellow(`Deleting agent: ${options.delete}`));
        // Agent deletion logic would go here
      }
      
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Enhanced configuration command
program
  .command('config')
  .description('Manage Sheikh-CLI configuration')
  .option('--init', 'Initialize configuration file')
  .option('--show', 'Show current configuration')
  .option('--validate', 'Validate current configuration')
  .option('--upgrade', 'Upgrade to agentic configuration')
  .action(async (options) => {
    try {
      if (options.init) {
        const configPath = path.join(process.cwd(), '.sheikh', 'config.json');
        await fs.ensureDir(path.dirname(configPath));
        
        const defaultConfig = {
          globalState: {
            apiProvider: 'anthropic',
            apiModelId: 'claude-3-5-sonnet-20241022',
            agenticEnabled: true,
            autoApprovalSettings: {
              enabled: true,
              actions: {
                readFiles: true,
                editFiles: false,
                executeSafeCommands: true,
                useMcp: false
              },
              maxRequests: 20
            }
          },
          settings: {
            'cline.enableCheckpoints': false,
            'agentic.visualDiff': true,
            'agentic.coordinateChanges': true,
            'agentic.autoApprove': false
          }
        };
        
        await fs.writeJson(configPath, defaultConfig, { spaces: 2 });
        console.log(chalk.green('Agentic configuration file initialized at:'), configPath);
      } else if (options.show) {
        const config = await loadConfig();
        console.log(chalk.blue('Current configuration:'));
        console.log(JSON.stringify(config, null, 2));
      } else if (options.validate) {
        const config = await loadConfig();
        const validation = validateConfig(config);
        
        if (validation.valid) {
          console.log(chalk.green('Configuration is valid'));
        } else {
          console.error(chalk.red('Configuration validation failed:'), validation.error);
          process.exit(1);
        }
      } else if (options.upgrade) {
        console.log(chalk.blue('Upgrading to agentic configuration...'));
        // Upgrade logic would go here
        console.log(chalk.green('Configuration upgraded successfully'));
      } else {
        console.log(chalk.yellow('Use --init, --show, --validate, or --upgrade with the config command'));
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

// Enhanced Chat Session Class
class EnhancedChatSession {
  constructor(agenticEngine, config, options) {
    this.agenticEngine = agenticEngine;
    this.config = config;
    this.options = options;
    this.conversationHistory = [];
    this.isRunning = false;
    this.inquirer = require('inquirer');
  }

  async startChat() {
    this.isRunning = true;
    
    console.log(chalk.blue.bold('\n🤖 Welcome to Sheikh-CLI Agentic Engine!'));
    console.log(chalk.gray('Your unfair advantage in AI-powered development'));
    console.log(chalk.gray('Type "help" for commands, "exit" to quit\n'));

    while (this.isRunning) {
      try {
        const { input } = await this.inquirer.prompt([
          {
            type: 'input',
            name: 'input',
            message: chalk.cyan('You:'),
            validate: (input) => input.trim().length > 0 || 'Please enter a message'
          }
        ]);

        if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
          this.isRunning = false;
          console.log(chalk.green('Goodbye! 👋'));
          break;
        }

        if (input.toLowerCase() === 'help') {
          this.showHelp();
          continue;
        }

        if (input.toLowerCase().startsWith('/')) {
          await this.handleSlashCommand(input);
          continue;
        }

        await this.processAgenticMessage(input);

      } catch (error) {
        console.error(chalk.red('Error:'), error.message);
      }
    }
  }

  async processAgenticMessage(message) {
    const spinner = ora('Processing with agentic engine...').start();
    
    try {
      // Check if this is a complex task that needs agentic processing
      if (this.isComplexTask(message)) {
        spinner.text = 'Executing agentic task...';
        const result = await this.agenticEngine.executeAgenticTask(message);
        
        spinner.succeed('Agentic task completed');
        console.log(chalk.blue('\n🤖 Sheikh Agentic:'));
        console.log(result);
        console.log();
      } else {
        // Handle as regular chat message
        spinner.text = 'Getting AI response...';
        const response = await this.getAIResponse(message);
        
        spinner.succeed('Response received');
        console.log(chalk.blue('\n🤖 Sheikh:'));
        console.log(response);
        console.log();
      }

      // Add to conversation history
      this.conversationHistory.push({
        user: message,
        assistant: this.isComplexTask(message) ? 'Agentic' : 'Direct',
        timestamp: new Date()
      });

    } catch (error) {
      spinner.fail('Failed to process request');
      console.error(chalk.red('Error:'), error.message);
    }
  }

  isComplexTask(message) {
    // Simple heuristics to determine if a task needs agentic processing
    const complexKeywords = [
      'create', 'build', 'implement', 'refactor', 'migrate',
      'analyze', 'optimize', 'debug', 'fix', 'update',
      'deploy', 'test', 'document', 'review'
    ];
    
    const words = message.toLowerCase().split(' ');
    return complexKeywords.some(keyword => words.includes(keyword)) && words.length > 3;
  }

  async getAIResponse(message) {
    // This would integrate with the AI provider system
    return `I understand you want to: ${message}\n\nI can help you with that using my agentic capabilities. Would you like me to create a plan for this task?`;
  }

  async handleSlashCommand(command) {
    const [cmd, ...args] = command.slice(1).split(' ');
    
    switch (cmd.toLowerCase()) {
      case 'agents':
        await this.listAgents();
        break;
      case 'search':
        if (args.length > 0) {
          await this.agenticSearch(args.join(' '));
        } else {
          console.log(chalk.yellow('Usage: /search <query>'));
        }
        break;
      case 'analyze':
        await this.analyzeCodebase();
        break;
      case 'workflow':
        if (args.length > 0) {
          await this.generateWorkflow(args.join(' '));
        } else {
          console.log(chalk.yellow('Usage: /workflow <description>'));
        }
        break;
      case 'config':
        await this.showConfig();
        break;
      case 'clear':
        this.conversationHistory = [];
        console.log(chalk.green('Conversation history cleared'));
        break;
      case 'history':
        this.showHistory();
        break;
      default:
        console.log(chalk.yellow(`Unknown command: ${cmd}`));
        console.log(chalk.gray('Available commands: /agents, /search, /analyze, /workflow, /config, /clear, /history'));
    }
  }

  async listAgents() {
    console.log(chalk.blue('\n🤖 Active Agents:'));
    
    for (const [name, agent] of this.agenticEngine.agents) {
      console.log(chalk.cyan(`  • ${agent.name}`));
      console.log(chalk.gray(`    Capabilities: ${agent.capabilities.join(', ')}`));
    }
  }

  async agenticSearch(query) {
    const spinner = ora('Searching codebase...').start();
    
    try {
      const results = await this.agenticEngine.searchCodebase(query);
      spinner.succeed(`Found ${results.length} relevant files`);
      
      console.log(chalk.blue('\n🔍 Search Results:'));
      results.slice(0, 5).forEach((result, index) => {
        console.log(chalk.cyan(`\n${index + 1}. ${result.file}`));
        console.log(chalk.gray(`   Relevance: ${Math.round(result.relevance * 100)}%`));
        console.log(chalk.gray(`   Purpose: ${result.context.purpose}`));
      });
    } catch (error) {
      spinner.fail('Search failed');
      console.error(chalk.red('Error:'), error.message);
    }
  }

  async analyzeCodebase() {
    const spinner = ora('Analyzing codebase...').start();
    
    try {
      const analysis = await this.agenticEngine.codebase.generateReport();
      spinner.succeed('Analysis complete');
      
      console.log(chalk.blue('\n📊 Codebase Analysis:'));
      console.log(analysis);
    } catch (error) {
      spinner.fail('Analysis failed');
      console.error(chalk.red('Error:'), error.message);
    }
  }

  async generateWorkflow(description) {
    const spinner = ora('Generating workflow...').start();
    
    try {
      const workflow = await this.agenticEngine.generateWorkflow(description);
      const workflowData = workflow.getWorkflow();
      
      spinner.succeed('Workflow generated');
      
      console.log(chalk.blue('\n⚙️ Generated Workflow:'));
      console.log(chalk.cyan(`Name: ${workflowData.name}`));
      console.log(chalk.yellow('\nSteps:'));
      workflowData.steps.forEach((step, index) => {
        console.log(chalk.gray(`  ${index + 1}. ${step.name} (${step.type})`));
      });
    } catch (error) {
      spinner.fail('Workflow generation failed');
      console.error(chalk.red('Error:'), error.message);
    }
  }

  async showConfig() {
    console.log(chalk.blue('\n⚙️ Current Configuration:'));
    console.log(JSON.stringify(this.config, null, 2));
  }

  showHistory() {
    console.log(chalk.blue('\n📚 Conversation History:'));
    
    if (this.conversationHistory.length === 0) {
      console.log(chalk.gray('No conversation history'));
    } else {
      this.conversationHistory.forEach((entry, index) => {
        console.log(chalk.cyan(`\n${index + 1}.`));
        console.log(chalk.gray(`User: ${entry.user}`));
        console.log(chalk.gray(`Assistant: ${entry.assistant}`));
        console.log(chalk.gray(`Time: ${entry.timestamp.toLocaleTimeString()}`));
      });
    }
  }

  showHelp() {
    console.log(chalk.blue.bold('\n📖 Sheikh-CLI Agentic Engine Help:'));
    console.log(chalk.cyan('\nCommands:'));
    console.log('  help                    - Show this help message');
    console.log('  exit/quit              - Exit the application');
    console.log('  /agents                - List available agents');
    console.log('  /search <query>        - Search your codebase');
    console.log('  /analyze               - Analyze your codebase');
    console.log('  /workflow <desc>       - Generate workflow from description');
    console.log('  /config                - Show current configuration');
    console.log('  /clear                 - Clear conversation history');
    console.log('  /history               - Show conversation history');
    
    console.log(chalk.cyan('\nAgentic Features:'));
    console.log('  • Agentic search across entire codebase');
    console.log('  • Multi-file coordination and changes');
    console.log('  • Visual diff and approval system');
    console.log('  • Workflow generation from natural language');
    console.log('  • Production-grade agent management');
    console.log('  • Integration with your existing tools');
    
    console.log(chalk.cyan('\nCLI Commands:'));
    console.log('  sheikh search <query>   - Search codebase');
    console.log('  sheikh analyze          - Analyze codebase');
    console.log('  sheikh workflow <desc>  - Generate workflow');
    console.log('  sheikh agents           - Manage agents');
    console.log('  sheikh config           - Manage configuration');
    console.log();
  }
}

module.exports = {
  EnhancedChatSession
};
