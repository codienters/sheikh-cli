import { Config, GlobalState, Settings, ApiKeys } from './types';
export declare class ConfigManager {
    private configPath;
    private config;
    constructor(configDir?: string);
    private getDefaultConfig;
    private loadConfig;
    saveConfig(): void;
    getConfig(): Config;
    updateGlobalState(updates: Partial<GlobalState>): void;
    updateSettings(updates: Partial<Settings>): void;
    getApiKeys(): ApiKeys;
    validateApiKeys(): {
        valid: boolean;
        missing: string[];
    };
}
//# sourceMappingURL=config.d.ts.map