/**
 * Ollama Provider Implementation
 *
 * Handles communication with local Ollama instance
 *
 * @module providers/ollama
 */

const axios = require('axios');

/**
 * OllamaProvider class
 * Handles Ollama API interactions
 */
class OllamaProvider {
  constructor() {
    this.name = 'ollama';
    this.baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.client = null;
  }

  /**
   * Initialize the provider
   * @returns {Promise<boolean>} True if initialized successfully
   */
  async initialize() {
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Test connection
    try {
      await this.client.get('/api/tags');
      return true;
    } catch (error) {
      throw new Error('Ollama is not running or not accessible. Please start Ollama and ensure it\'s running on the correct port.');
    }
  }

  /**
   * Send a message to Ollama
   * @param {string} message - Message to send
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Response from Ollama
   */
  async sendMessage(message, options = {}) {
    if (!this.client) {
      await this.initialize();
    }

    const model = options.model || 'llama2';
    const payload = {
      model: model,
      prompt: message,
      stream: false,
      options: {
        temperature: options.temperature || 0.7,
        num_predict: options.maxTokens || 1000
      }
    };

    try {
      const response = await this.client.post('/api/generate', payload);
      return {
        content: response.data.response,
        usage: {
          prompt_tokens: response.data.prompt_eval_count || 0,
          completion_tokens: response.data.eval_count || 0,
          total_tokens: (response.data.prompt_eval_count || 0) + (response.data.eval_count || 0)
        },
        model: model
      };
    } catch (error) {
      throw new Error(`Ollama API error: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Check if the provider is available
   * @returns {Promise<boolean>} True if Ollama is running
   */
  async isAvailable() {
    try {
      if (!this.client) {
        this.client = axios.create({
          baseURL: this.baseURL,
          timeout: 5000
        });
      }
      await this.client.get('/api/tags');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get available models
   * @returns {Promise<Array<string>>} List of available models
   */
  async getAvailableModels() {
    try {
      if (!this.client) {
        await this.initialize();
      }
      
      const response = await this.client.get('/api/tags');
      return response.data.models.map(model => model.name);
    } catch (error) {
      return ['llama2', 'codellama', 'mistral'];
    }
  }

  /**
   * Pull a model from Ollama registry
   * @param {string} modelName - Name of the model to pull
   * @returns {Promise<void>}
   */
  async pullModel(modelName) {
    if (!this.client) {
      await this.initialize();
    }

    try {
      await this.client.post('/api/pull', { name: modelName });
    } catch (error) {
      throw new Error(`Failed to pull model ${modelName}: ${error.message}`);
    }
  }

  /**
   * List installed models
   * @returns {Promise<Array<Object>>} List of installed models
   */
  async listModels() {
    try {
      if (!this.client) {
        await this.initialize();
      }
      
      const response = await this.client.get('/api/tags');
      return response.data.models;
    } catch (error) {
      throw new Error(`Failed to list models: ${error.message}`);
    }
  }
}

module.exports = OllamaProvider;
