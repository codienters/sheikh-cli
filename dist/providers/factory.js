"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIProviderFactory = void 0;
const anthropic_1 = require("./anthropic");
const openai_1 = require("./openai");
const aws_1 = require("./aws");
class AIProviderFactory {
    static createProvider(providerName, modelId, configManager) {
        const apiKeys = configManager.getApiKeys();
        const config = configManager.getConfig();
        const baseConfig = {
            modelId,
            region: config.globalState.awsRegion,
            projectId: config.globalState.vertexProjectId
        };
        switch (providerName.toLowerCase()) {
            case 'anthropic':
                return new anthropic_1.AnthropicProvider({
                    ...baseConfig,
                    apiKey: apiKeys.API_KEY,
                    baseUrl: config.globalState.anthropicBaseUrl
                });
            case 'openai':
                return new openai_1.OpenAIProvider({
                    ...baseConfig,
                    apiKey: apiKeys.OPEN_AI_API_KEY,
                    baseUrl: config.globalState.openAiBaseUrl
                });
            case 'openrouter':
                return new openai_1.OpenAIProvider({
                    ...baseConfig,
                    apiKey: apiKeys.OPEN_ROUTER_API_KEY,
                    baseUrl: 'https://openrouter.ai/api/v1'
                });
            case 'aws':
            case 'bedrock':
                return new aws_1.AWSBedrockProvider({
                    ...baseConfig,
                    region: config.globalState.awsRegion
                });
            default:
                throw new Error(`Unsupported AI provider: ${providerName}`);
        }
    }
    static getSupportedProviders() {
        return ['anthropic', 'openai', 'openrouter', 'aws', 'bedrock'];
    }
}
exports.AIProviderFactory = AIProviderFactory;
//# sourceMappingURL=factory.js.map