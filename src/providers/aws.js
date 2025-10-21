/**
 * AWS Provider Implementation
 *
 * Handles communication with AWS Bedrock
 *
 * @module providers/aws
 */

const axios = require('axios');

/**
 * AWSProvider class
 * Handles AWS Bedrock API interactions
 */
class AWSProvider {
  constructor() {
    this.name = 'aws';
    this.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    this.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    this.region = process.env.AWS_DEFAULT_REGION || 'us-east-1';
    this.baseURL = `https://bedrock-runtime.${this.region}.amazonaws.com`;
    this.client = null;
  }

  /**
   * Initialize the provider
   * @returns {Promise<boolean>} True if initialized successfully
   */
  async initialize() {
    if (!this.accessKeyId || !this.secretAccessKey) {
      throw new Error('AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables are required');
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return true;
  }

  /**
   * Send a message to AWS Bedrock
   * @param {string} message - Message to send
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Response from AWS Bedrock
   */
  async sendMessage(message, options = {}) {
    if (!this.client) {
      await this.initialize();
    }

    const modelId = options.model || 'anthropic.claude-3-sonnet-20240229-v1:0';
    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: options.maxTokens || 1000,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    };

    try {
      const response = await this.client.post(`/model/${modelId}/invoke`, payload);
      return {
        content: response.data.content[0].text,
        usage: response.data.usage,
        model: modelId
      };
    } catch (error) {
      throw new Error(`AWS Bedrock API error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Check if the provider is available
   * @returns {boolean} True if credentials are available
   */
  isAvailable() {
    return !!(this.accessKeyId && this.secretAccessKey);
  }

  /**
   * Get available models
   * @returns {Array<string>} List of available models
   */
  getAvailableModels() {
    return [
      'anthropic.claude-3-sonnet-20240229-v1:0',
      'anthropic.claude-3-haiku-20240307-v1:0',
      'anthropic.claude-3-opus-20240229-v1:0'
    ];
  }
}

module.exports = AWSProvider;
