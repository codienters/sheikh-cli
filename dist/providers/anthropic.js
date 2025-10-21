"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnthropicProvider = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
class AnthropicProvider {
    constructor(config) {
        if (!config.apiKey) {
            throw new Error('Anthropic API key is required');
        }
        this.client = new sdk_1.default({
            apiKey: config.apiKey,
            baseURL: config.baseUrl
        });
        this.modelId = config.modelId;
    }
    async generateResponse(prompt) {
        try {
            const response = await this.client.messages.create({
                model: this.modelId,
                max_tokens: 4096,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            });
            return response.content
                .filter((block) => block.type === 'text')
                .map((block) => block.type === 'text' ? block.text : '')
                .join('');
        }
        catch (error) {
            throw new Error(`Anthropic API error: ${error}`);
        }
    }
    getModelName() {
        return this.modelId;
    }
    getProviderName() {
        return 'anthropic';
    }
}
exports.AnthropicProvider = AnthropicProvider;
//# sourceMappingURL=anthropic.js.map