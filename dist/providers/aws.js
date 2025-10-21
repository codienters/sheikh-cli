"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWSBedrockProvider = void 0;
const client_bedrock_runtime_1 = require("@aws-sdk/client-bedrock-runtime");
class AWSBedrockProvider {
    constructor(config) {
        this.client = new client_bedrock_runtime_1.BedrockRuntimeClient({
            region: config.region || 'us-east-1'
        });
        this.modelId = config.modelId;
    }
    async generateResponse(prompt) {
        try {
            const request = {
                modelId: this.modelId,
                contentType: 'application/json',
                accept: 'application/json',
                body: JSON.stringify({
                    prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
                    max_tokens_to_sample: 4096,
                    temperature: 0.7
                })
            };
            const command = new client_bedrock_runtime_1.InvokeModelCommand(request);
            const response = await this.client.send(command);
            if (!response.body) {
                throw new Error('Empty response from AWS Bedrock');
            }
            const responseBody = JSON.parse(new TextDecoder().decode(response.body));
            return responseBody.completion || responseBody.outputs?.[0]?.text || '';
        }
        catch (error) {
            throw new Error(`AWS Bedrock API error: ${error}`);
        }
    }
    getModelName() {
        return this.modelId;
    }
    getProviderName() {
        return 'aws';
    }
}
exports.AWSBedrockProvider = AWSBedrockProvider;
//# sourceMappingURL=aws.js.map