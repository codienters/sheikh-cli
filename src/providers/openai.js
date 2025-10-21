/**
 * OpenAI Provider Implementation
 *
 * Handles communication with OpenAI's GPT API
 *
 * @module providers/openai
 */

const axios = require('axios');

/**
 * OpenAIProvider class
 * Handles OpenAI GPT API interactions
 */
class OpenAIProvider {
  constructor() {
    this.name = 'openai';
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
    this.client = null;
  }

  /**
   * Initialize the provider
   * @returns {Promise<boolean>} True if initialized successfully
   */
  async initialize() {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return true;
  }

  /**
   * Send a message to GPT
   * @param {string} message - Message to send
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Response from GPT
   */
  async sendMessage(message, options = {}) {
    if (!this.client) {
      await this.initialize();
    }

    const payload = {
      model: options.model || 'gpt-4',
      messages: [
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7
    };

    try {
      const response = await this.client.post('/chat/completions', payload);
      return {
        content: response.data.choices[0].message.content,
        usage: response.data.usage,
        model: response.data.model
      };
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Check if the provider is available
   * @returns {boolean} True if API key is available
   */
  isAvailable() {
    return !!this.apiKey;
  }

  /**
   * Get available models
   * @returns {Array<string>} List of available models
   */
  getAvailableModels() {
    return [
      'gpt-4',
      'gpt-4-turbo',
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k'
    ];
  }
}

module.exports = OpenAIProvider;
