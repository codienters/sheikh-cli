"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assistant = void 0;
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
const providers_1 = require("../providers");
class Assistant {
    constructor(configManager, options) {
        this.configManager = configManager;
        this.options = options;
        this.spinner = (0, ora_1.default)();
        // Override config with CLI options
        const config = configManager.getConfig();
        const providerName = options.provider || config.globalState.apiProvider;
        const modelId = options.model || config.globalState.apiModelId;
        this.provider = providers_1.AIProviderFactory.createProvider(providerName, modelId, configManager);
    }
    async startChat() {
        console.log(chalk_1.default.blue('🤖 Welcome to Sheikh-CLI!'));
        console.log(chalk_1.default.gray('How can I help you today?\n'));
        while (true) {
            const { message } = await inquirer_1.default.prompt([
                {
                    type: 'input',
                    name: 'message',
                    message: chalk_1.default.cyan('You:'),
                    validate: (input) => input.trim() !== '' || 'Please enter a message'
                }
            ]);
            if (message.toLowerCase() === 'exit' || message.toLowerCase() === 'quit') {
                console.log(chalk_1.default.yellow('Goodbye! 👋'));
                break;
            }
            await this.processMessage(message);
        }
    }
    async executeTask(task) {
        this.spinner.start('Processing task...');
        try {
            const response = await this.provider.generateResponse(task);
            this.spinner.succeed('Task completed');
            console.log(chalk_1.default.green('Response:'));
            console.log(response);
        }
        catch (error) {
            this.spinner.fail('Task failed');
            throw error;
        }
    }
    async processMessage(message) {
        this.spinner.start('Thinking...');
        try {
            const response = await this.provider.generateResponse(message);
            this.spinner.succeed('Response ready');
            console.log(chalk_1.default.green('Assistant:'));
            console.log(response);
            console.log();
        }
        catch (error) {
            this.spinner.fail('Error processing message');
            console.error(chalk_1.default.red('Error:'), error);
        }
    }
    async validateSetup() {
        const validation = this.configManager.validateApiKeys();
        if (!validation.valid) {
            console.log(chalk_1.default.red('❌ Missing required API keys:'));
            validation.missing.forEach(key => {
                console.log(chalk_1.default.red(`  - ${key}`));
            });
            console.log(chalk_1.default.yellow('\nPlease set the required environment variables.'));
            return false;
        }
        console.log(chalk_1.default.green('✅ Configuration validated successfully'));
        return true;
    }
}
exports.Assistant = Assistant;
//# sourceMappingURL=assistant.js.map