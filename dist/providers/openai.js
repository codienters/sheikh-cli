"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
const openai_1 = __importDefault(require("openai"));
class OpenAIProvider {
    constructor(config) {
        if (!config.apiKey) {
            throw new Error('OpenAI API key is required');
        }
        this.client = new openai_1.default({
            apiKey: config.apiKey,
            baseURL: config.baseUrl
        });
        this.modelId = config.modelId;
    }
    async generateResponse(prompt) {
        try {
            const response = await this.client.chat.completions.create({
                model: this.modelId,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 4096,
                temperature: 0.7
            });
            return response.choices[0]?.message?.content || '';
        }
        catch (error) {
            throw new Error(`OpenAI API error: ${error}`);
        }
    }
    getModelName() {
        return this.modelId;
    }
    getProviderName() {
        return 'openai';
    }
}
exports.OpenAIProvider = OpenAIProvider;
//# sourceMappingURL=openai.js.map