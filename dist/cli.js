#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("./config");
const assistant_1 = require("./core/assistant");
const program = new commander_1.Command();
program
    .name('sheikh')
    .description('A powerful AI assistant CLI for developers')
    .version('1.0.0');
program
    .option('-c, --config <path>', 'Path to configuration file')
    .option('-p, --provider <provider>', 'AI provider (anthropic, openai, etc.)')
    .option('-m, --model <model>', 'AI model ID')
    .option('--full-auto', 'Run in fully automated mode')
    .option('--auto-approve-mcp', 'Automatically approve all MCP tool usage')
    .option('--custom-instructions <instructions>', 'Custom instructions for the task')
    .option('-w, --workspace <path>', 'Specify custom workspace directory');
program
    .command('chat')
    .description('Start interactive chat session')
    .action(async () => {
    const options = program.opts();
    try {
        const configManager = new config_1.ConfigManager(options.config);
        const assistant = new assistant_1.Assistant(configManager, options);
        console.log(chalk_1.default.blue('🤖 Sheikh-CLI Assistant'));
        console.log(chalk_1.default.gray('Type your message or "exit" to quit\n'));
        await assistant.startChat();
    }
    catch (error) {
        console.error(chalk_1.default.red('Error starting chat:'), error);
        process.exit(1);
    }
});
program
    .command('config')
    .description('Manage configuration')
    .option('--list', 'List current configuration')
    .option('--validate', 'Validate API keys and configuration')
    .action(async (options) => {
    const configManager = new config_1.ConfigManager(program.opts().config);
    if (options.list) {
        const config = configManager.getConfig();
        console.log(JSON.stringify(config, null, 2));
    }
    else if (options.validate) {
        const validation = configManager.validateApiKeys();
        if (validation.valid) {
            console.log(chalk_1.default.green('✅ Configuration is valid'));
        }
        else {
            console.log(chalk_1.default.red('❌ Missing API keys:'), validation.missing.join(', '));
        }
    }
});
program
    .command('run <task>')
    .description('Execute a specific task')
    .action(async (task, options) => {
    const configManager = new config_1.ConfigManager(program.opts().config);
    const assistant = new assistant_1.Assistant(configManager, program.opts());
    try {
        await assistant.executeTask(task);
    }
    catch (error) {
        console.error(chalk_1.default.red('Error executing task:'), error);
        process.exit(1);
    }
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error(chalk_1.default.red('Unhandled Rejection at:'), promise, 'reason:', reason);
    process.exit(1);
});
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error(chalk_1.default.red('Uncaught Exception:'), error);
    process.exit(1);
});
program.parse();
//# sourceMappingURL=cli.js.map