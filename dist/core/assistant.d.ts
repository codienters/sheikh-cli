import { ConfigManager } from '../config';
export interface AssistantOptions {
    provider?: string;
    model?: string;
    fullAuto?: boolean;
    autoApproveMcp?: boolean;
    customInstructions?: string;
    workspace?: string;
}
export declare class Assistant {
    private configManager;
    private options;
    private provider;
    private spinner;
    constructor(configManager: ConfigManager, options: AssistantOptions);
    startChat(): Promise<void>;
    executeTask(task: string): Promise<void>;
    private processMessage;
    validateSetup(): Promise<boolean>;
}
//# sourceMappingURL=assistant.d.ts.map