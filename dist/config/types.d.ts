export interface AutoApprovalSettings {
    enabled: boolean;
    actions: {
        readFiles: boolean;
        editFiles: boolean;
        executeSafeCommands: boolean;
        useMcp: boolean;
    };
    maxRequests: number;
}
export interface GlobalState {
    apiProvider: string;
    apiModelId: string;
    awsRegion?: string;
    awsBedrockEndpoint?: string;
    vertexProjectId?: string;
    vertexRegion?: string;
    openAiBaseUrl?: string;
    openAiModelId?: string;
    ollamaModelId?: string;
    ollamaBaseUrl?: string;
    anthropicBaseUrl?: string;
    autoApprovalSettings: AutoApprovalSettings;
}
export interface Settings {
    enableCheckpoints: boolean;
}
export interface Config {
    globalState: GlobalState;
    settings: Settings;
}
export interface ApiKeys {
    API_KEY?: string;
    OPEN_ROUTER_API_KEY?: string;
    CLINE_API_KEY?: string;
    AWS_ACCESS_KEY?: string;
    AWS_SECRET_KEY?: string;
    AWS_SESSION_TOKEN?: string;
    OPEN_AI_API_KEY?: string;
    GEMINI_API_KEY?: string;
    OPEN_AI_NATIVE_API_KEY?: string;
    DEEP_SEEK_API_KEY?: string;
    REQUESTY_API_KEY?: string;
    TOGETHER_API_KEY?: string;
    QWEN_API_KEY?: string;
    DOUBAO_API_KEY?: string;
    MISTRAL_API_KEY?: string;
    LITE_LLM_API_KEY?: string;
    ASKSAGE_API_KEY?: string;
    XAI_API_KEY?: string;
    SAMBANOVA_API_KEY?: string;
}
//# sourceMappingURL=types.d.ts.map