import { AIProvider, ProviderConfig } from './types';
export declare class AWSBedrockProvider implements AIProvider {
    private client;
    private modelId;
    constructor(config: ProviderConfig);
    generateResponse(prompt: string): Promise<string>;
    getModelName(): string;
    getProviderName(): string;
}
//# sourceMappingURL=aws.d.ts.map