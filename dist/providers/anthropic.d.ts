import { AIProvider, ProviderConfig } from './types';
export declare class AnthropicProvider implements AIProvider {
    private client;
    private modelId;
    constructor(config: ProviderConfig);
    generateResponse(prompt: string): Promise<string>;
    getModelName(): string;
    getProviderName(): string;
}
//# sourceMappingURL=anthropic.d.ts.map