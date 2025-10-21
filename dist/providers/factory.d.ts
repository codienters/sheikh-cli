import { AIProvider } from './types';
import { ConfigManager } from '../config';
export declare class AIProviderFactory {
    static createProvider(providerName: string, modelId: string, configManager: ConfigManager): AIProvider;
    static getSupportedProviders(): string[];
}
//# sourceMappingURL=factory.d.ts.map