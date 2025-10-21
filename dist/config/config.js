"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
class ConfigManager {
    constructor(configDir) {
        this.configPath = path.join(configDir || process.cwd(), 'settings.json');
        this.config = this.loadConfig();
    }
    getDefaultConfig() {
        return {
            globalState: {
                apiProvider: 'anthropic',
                apiModelId: 'claude-3-7-sonnet-20250219',
                autoApprovalSettings: {
                    enabled: true,
                    actions: {
                        readFiles: true,
                        editFiles: false,
                        executeSafeCommands: true,
                        useMcp: false
                    },
                    maxRequests: 20
                }
            },
            settings: {
                enableCheckpoints: false
            }
        };
    }
    loadConfig() {
        try {
            if (fs.existsSync(this.configPath)) {
                const configData = fs.readFileSync(this.configPath, 'utf-8');
                return JSON.parse(configData);
            }
        }
        catch (error) {
            console.warn(`Failed to load config from ${this.configPath}:`, error);
        }
        return this.getDefaultConfig();
    }
    saveConfig() {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
        }
        catch (error) {
            throw new Error(`Failed to save config to ${this.configPath}: ${error}`);
        }
    }
    getConfig() {
        return { ...this.config };
    }
    updateGlobalState(updates) {
        this.config.globalState = { ...this.config.globalState, ...updates };
        this.saveConfig();
    }
    updateSettings(updates) {
        this.config.settings = { ...this.config.settings, ...updates };
        this.saveConfig();
    }
    getApiKeys() {
        const envKeys = {};
        // List of all supported API keys
        const keyNames = [
            'API_KEY',
            'OPEN_ROUTER_API_KEY',
            'CLINE_API_KEY',
            'AWS_ACCESS_KEY',
            'AWS_SECRET_KEY',
            'AWS_SESSION_TOKEN',
            'OPEN_AI_API_KEY',
            'GEMINI_API_KEY',
            'OPEN_AI_NATIVE_API_KEY',
            'DEEP_SEEK_API_KEY',
            'REQUESTY_API_KEY',
            'TOGETHER_API_KEY',
            'QWEN_API_KEY',
            'DOUBAO_API_KEY',
            'MISTRAL_API_KEY',
            'LITE_LLM_API_KEY',
            'ASKSAGE_API_KEY',
            'XAI_API_KEY',
            'SAMBANOVA_API_KEY'
        ];
        keyNames.forEach(keyName => {
            const value = process.env[keyName];
            if (value) {
                envKeys[keyName] = value;
            }
        });
        return envKeys;
    }
    validateApiKeys() {
        const availableKeys = this.getApiKeys();
        const provider = this.config.globalState.apiProvider;
        const requiredKeys = {
            anthropic: ['API_KEY'],
            openai: ['OPEN_AI_API_KEY'],
            openrouter: ['OPEN_ROUTER_API_KEY'],
            aws: ['AWS_ACCESS_KEY', 'AWS_SECRET_KEY'],
            vertex: ['GEMINI_API_KEY'],
            deepseek: ['DEEP_SEEK_API_KEY'],
            together: ['TOGETHER_API_KEY'],
            qwen: ['QWEN_API_KEY'],
            doubao: ['DOUBAO_API_KEY'],
            mistral: ['MISTRAL_API_KEY'],
            litellm: ['LITE_LLM_API_KEY'],
            asksage: ['ASKSAGE_API_KEY'],
            xai: ['XAI_API_KEY'],
            sambanova: ['SAMBANOVA_API_KEY']
        };
        const required = requiredKeys[provider] || [];
        const missing = required.filter(key => !availableKeys[key]);
        return {
            valid: missing.length === 0,
            missing
        };
    }
}
exports.ConfigManager = ConfigManager;
//# sourceMappingURL=config.js.map