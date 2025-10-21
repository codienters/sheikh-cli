export interface AIProvider {
    generateResponse(prompt: string): Promise<string>;
    getModelName(): string;
    getProviderName(): string;
}
export interface ProviderConfig {
    apiKey?: string;
    baseUrl?: string;
    modelId: string;
    region?: string;
    projectId?: string;
}
//# sourceMappingURL=types.d.ts.map