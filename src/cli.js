#!/usr/bin/env node

/**
 * Sheikh-CLI Main Entry Point
 * 
 * This is the main CLI application that provides AI-powered development tools
 * with multi-provider support, custom skills, and agents.
 * 
 * @fileoverview Main CLI entry point for Sheikh-CLI
 * @author Sheikh-CLI Team
 * @version 2.0.0
 */

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const { config } = require('dotenv');
const path = require('path');
const fs = require('fs-extra');

// Load environment variables
config();

const program = new Command();

program
  .name('sheikh')
  .description('AI agents your unfair advantage - powerful AI capabilities in your terminal')
  .version('1.0.0');

/**
 * Chat command handler
 * Starts an interactive chat session with AI capabilities
 * @param {Object} options - Command options
 * @param {string} [options.provider] - AI provider to use
 * @param {string} [options.model] - Model to use
 * @param {boolean} [options.fullAuto] - Run in fully automated mode
 * @param {boolean} [options.autoApproveMcp] - Automatically approve all MCP tool usage requests
 * @param {string} [options.customInstructions] - Custom instructions for the task
 * @param {string} [options.workspace] - Custom workspace directory path
 */
// Chat command
program
  .command('chat')
  .description('Start an interactive chat session with AI')
  .option('-p, --provider <provider>', 'AI provider to use')
  .option('-m, --model <model>', 'Model to use')
  .option('--full-auto', 'Run in fully automated mode')
  .option('--auto-approve-mcp', 'Automatically approve all MCP tool usage requests')
  .option('--custom-instructions <instructions>', 'Provide custom instructions for the task')
  .option('--workspace <path>', 'Specify a custom workspace directory path')
  .action(async (options) => {
    try {
      const spinner = ora('Initializing Sheikh-CLI...').start();
      
      // Load configuration
      const config = await loadConfig();
      
      spinner.succeed('Sheikh-CLI initialized successfully');
      
      // Start chat session
      const chatSession = new ChatSession(config, options);
      await chatSession.startChat();
      
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Configuration command handler
 * Manages Sheikh-CLI configuration settings
 * @param {Object} options - Command options
 * @param {boolean} [options.init] - Initialize configuration file
 * @param {boolean} [options.show] - Show current configuration
 * @param {boolean} [options.validate] - Validate current configuration
 */
// Configuration command
program
  .command('config')
  .description('Manage Sheikh-CLI configuration')
  .option('--init', 'Initialize configuration file')
  .option('--show', 'Show current configuration')
  .option('--validate', 'Validate current configuration')
  .action(async (options) => {
    try {
      if (options.init) {
        await initializeConfig();
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
      } else {
        console.log(chalk.yellow('Use --init, --show, or --validate with the config command'));
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Agents command handler
 * Manages AI agents and their capabilities
 * @param {Object} options - Command options
 * @param {boolean} [options.list] - List all available agents
 * @param {string} [options.create] - Create a new custom agent
 * @param {string} [options.delete] - Delete an agent
 */
// Agents command
program
  .command('agents')
  .description('Manage AI agents and their capabilities')
  .option('--list', 'List all available agents')
  .option('--create <name>', 'Create a new custom agent')
  .option('--delete <name>', 'Delete an agent')
  .action(async (options) => {
    try {
      if (options.list || !Object.keys(options).length) {
        console.log(chalk.blue('\n🤖 Available Agents:'));
        console.log(chalk.cyan('  • debugger - Debugging specialist'));
        console.log(chalk.cyan('  • test-runner - Test automation expert'));
        console.log(chalk.cyan('  • data-scientist - Data analysis expert'));
        console.log(chalk.cyan('  • code-reviewer - Code quality specialist'));
        console.log(chalk.cyan('  • git-helper - Git operations expert'));
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

/**
 * Skills command handler
 * Manages custom skills and capabilities
 * @param {Object} options - Command options
 * @param {boolean} [options.list] - List all available skills
 * @param {string} [options.create] - Create a new custom skill
 * @param {string} [options.delete] - Delete a skill
 */
// Skills command
program
  .command('skills')
  .description('Manage custom skills and capabilities')
  .option('--list', 'List all available skills')
  .option('--create <name>', 'Create a new custom skill')
  .option('--delete <name>', 'Delete a skill')
  .action(async (options) => {
    try {
      if (options.list || !Object.keys(options).length) {
        console.log(chalk.blue('\n🛠️ Available Skills:'));
        console.log(chalk.cyan('  • code-review - Code quality analysis'));
        console.log(chalk.cyan('  • git-helper - Git workflow assistance'));
        console.log(chalk.cyan('  • test-runner - Test automation'));
        console.log(chalk.cyan('  • documentation - Documentation generation'));
      }
      
      if (options.create) {
        console.log(chalk.yellow(`Creating skill: ${options.create}`));
        // Skill creation logic would go here
      }
      
      if (options.delete) {
        console.log(chalk.yellow(`Deleting skill: ${options.delete}`));
        // Skill deletion logic would go here
      }
      
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Parse command line arguments (only if not in test environment)
if (process.env.NODE_ENV !== 'test') {
  program.parse();

  // If no command provided, show help
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
}

/**
 * Load configuration from file or return default configuration
 * @returns {Promise<Object>} Configuration object
 */
async function loadConfig() {
  const configPath = path.join(process.cwd(), '.sheikh', 'config.json');
  
  if (await fs.pathExists(configPath)) {
    return await fs.readJson(configPath);
  }
  
  return getDefaultConfig();
}

/**
 * Get default configuration object
 * @returns {Object} Default configuration
 */
function getDefaultConfig() {
  return {
    apiProvider: 'anthropic',
    apiModelId: 'claude-3-5-sonnet-20241022',
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
  };
}

/**
 * Validate configuration object
 * @param {Object} config - Configuration to validate
 * @returns {Object} Validation result with valid boolean and optional error message
 */
function validateConfig(config) {
  const validProviders = ['anthropic', 'openai', 'aws', 'google', 'ollama'];
  
  if (!config.apiProvider || !validProviders.includes(config.apiProvider)) {
    return {
      valid: false,
      error: `Invalid API provider. Must be one of: ${validProviders.join(', ')}`
    };
  }
  
  if (!config.apiModelId) {
    return {
      valid: false,
      error: 'API model ID is required'
    };
  }
  
  return { valid: true };
}

/**
 * Initialize configuration file with default settings
 * @returns {Promise<void>}
 */
async function initializeConfig() {
  const configPath = path.join(process.cwd(), '.sheikh', 'config.json');
  await fs.ensureDir(path.dirname(configPath));
  
  const defaultConfig = getDefaultConfig();
  await fs.writeJson(configPath, defaultConfig, { spaces: 2 });
  
  console.log(chalk.green('Configuration file initialized at:'), configPath);
}

/**
 * Chat Session Class
 * Handles interactive chat sessions with AI capabilities
 */
class ChatSession {
  /**
   * Create a new chat session
   * @param {Object} config - Configuration object
   * @param {Object} options - Command line options
   */
  constructor(config, options) {
    this.config = config;
    this.options = options;
    this.conversationHistory = [];
    this.isRunning = false;
    this.inquirer = require('inquirer');
  }

  /**
   * Start the interactive chat session
   * @returns {Promise<void>}
   */
  async startChat() {
    this.isRunning = true;
    
    console.log(chalk.blue.bold('\n🤖 Welcome to Sheikh-CLI!'));
    console.log(chalk.gray('Your AI-powered development assistant'));
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

        await this.processMessage(input);

      } catch (error) {
        console.error(chalk.red('Error:'), error.message);
      }
    }
  }

  /**
   * Process a user message and generate AI response
   * @param {string} message - User message to process
   * @returns {Promise<void>}
   */
  async processMessage(message) {
    const spinner = ora('Processing message...').start();
    
    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = `I understand you want to: ${message}\n\nI can help you with that using my AI capabilities.`;
      
      spinner.succeed('Response received');
      console.log(chalk.blue('\n🤖 Sheikh:'));
      console.log(response);
      console.log();

      // Add to conversation history
      this.conversationHistory.push({
        user: message,
        assistant: response,
        timestamp: new Date()
      });

    } catch (error) {
      spinner.fail('Failed to process request');
      console.error(chalk.red('Error:'), error.message);
    }
  }

  /**
   * Handle slash commands in chat
   * @param {string} command - Slash command to handle
   * @returns {Promise<void>}
   */
  async handleSlashCommand(command) {
    const [cmd, ...args] = command.slice(1).split(' ');
    
    switch (cmd.toLowerCase()) {
      case 'agents':
        await this.listAgents();
        break;
      case 'skills':
        await this.listSkills();
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
        console.log(chalk.gray('Available commands: /agents, /skills, /config, /clear, /history'));
    }
  }

  /**
   * List available agents
   * @returns {Promise<void>}
   */
  async listAgents() {
    console.log(chalk.blue('\n🤖 Available Agents:'));
    console.log(chalk.cyan('  • debugger - Debugging specialist'));
    console.log(chalk.cyan('  • test-runner - Test automation expert'));
    console.log(chalk.cyan('  • data-scientist - Data analysis expert'));
    console.log(chalk.cyan('  • code-reviewer - Code quality specialist'));
    console.log(chalk.cyan('  • git-helper - Git operations expert'));
  }

  /**
   * List available skills
   * @returns {Promise<void>}
   */
  async listSkills() {
    console.log(chalk.blue('\n🛠️ Available Skills:'));
    console.log(chalk.cyan('  • code-review - Code quality analysis'));
    console.log(chalk.cyan('  • git-helper - Git workflow assistance'));
    console.log(chalk.cyan('  • test-runner - Test automation'));
    console.log(chalk.cyan('  • documentation - Documentation generation'));
  }

  /**
   * Show current configuration
   * @returns {Promise<void>}
   */
  async showConfig() {
    console.log(chalk.blue('\n⚙️ Current Configuration:'));
    console.log(JSON.stringify(this.config, null, 2));
  }

  /**
   * Show conversation history
   * @returns {void}
   */
  showHistory() {
    console.log(chalk.blue('\n📚 Conversation History:'));
    
    if (this.conversationHistory.length === 0) {
      console.log(chalk.gray('No conversation history'));
    } else {
      this.conversationHistory.forEach((entry, index) => {
        console.log(chalk.cyan(`\n${index + 1}.`));
        console.log(chalk.gray(`User: ${entry.user}`));
        console.log(chalk.gray(`Assistant: ${entry.assistant.substring(0, 100)}...`));
        console.log(chalk.gray(`Time: ${entry.timestamp.toLocaleTimeString()}`));
      });
    }
  }

  showHelp() {
    console.log(chalk.blue.bold('\n📖 Sheikh-CLI Help:'));
    console.log(chalk.cyan('\nCommands:'));
    console.log('  help                    - Show this help message');
    console.log('  exit/quit              - Exit the application');
    console.log('  /agents                - List available agents');
    console.log('  /skills                - List available skills');
    console.log('  /config                - Show current configuration');
    console.log('  /clear                 - Clear conversation history');
    console.log('  /history               - Show conversation history');
    
    console.log(chalk.cyan('\nCLI Commands:'));
    console.log('  sheikh chat            - Start interactive chat');
    console.log('  sheikh config          - Manage configuration');
    console.log('  sheikh agents          - Manage agents');
    console.log('  sheikh skills          - Manage skills');
    console.log();
  }
}

module.exports = program;
