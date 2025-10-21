/**
 * Anthropic Provider Implementation
 *
 * Handles communication with Anthropic's Claude API
 *
 * @module providers/anthropic
 */

const axios = require('axios');

/**
 * AnthropicProvider class
 * Handles Anthropic Claude API interactions
 */
class AnthropicProvider {
  constructor() {
    this.name = 'anthropic';
    this.apiKey = process.env.ANTHROPIC_API_KEY || process.env.API_KEY;
    this.baseURL = 'https://api.anthropic.com/v1';
    this.client = null;
  }

  /**
   * Initialize the provider
   * @returns {Promise<boolean>} True if initialized successfully
   */
  async initialize() {
    if (!this.apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      }
    });

    return true;
  }

  /**
   * Send a message to Claude
   * @param {string} message - Message to send
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Response from Claude
   */
  async sendMessage(message, options = {}) {
    if (!this.client) {
      await this.initialize();
    }

    const payload = {
      model: options.model || 'claude-3-5-sonnet-20241022',
      max_tokens: options.maxTokens || 1000,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    };

    try {
      const response = await this.client.post('/messages', payload);
      return {
        content: response.data.content[0].text,
        usage: response.data.usage,
        model: response.data.model
      };
    } catch (error) {
      throw new Error(`Anthropic API error: ${error.response?.data?.error?.message || error.message}`);
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
      'claude-3-5-sonnet-20241022',
      'claude-3-5-haiku-20241022',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307'
    ];
  }
}

module.exports = AnthropicProvider;
