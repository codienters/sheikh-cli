/**
 * Google Provider Implementation
 *
 * Handles communication with Google Vertex AI
 *
 * @module providers/google
 */

const axios = require('axios');

/**
 * GoogleProvider class
 * Handles Google Vertex AI API interactions
 */
class GoogleProvider {
  constructor() {
    this.name = 'google';
    this.apiKey = process.env.GOOGLE_API_KEY;
    this.projectId = process.env.GOOGLE_PROJECT_ID;
    this.location = process.env.GOOGLE_LOCATION || 'us-central1';
    this.baseURL = `https://${this.location}-aiplatform.googleapis.com/v1`;
    this.client = null;
  }

  /**
   * Initialize the provider
   * @returns {Promise<boolean>} True if initialized successfully
   */
  async initialize() {
    if (!this.apiKey || !this.projectId) {
      throw new Error('GOOGLE_API_KEY and GOOGLE_PROJECT_ID environment variables are required');
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
   * Send a message to Google Vertex AI
   * @param {string} message - Message to send
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Response from Google Vertex AI
   */
  async sendMessage(message, options = {}) {
    if (!this.client) {
      await this.initialize();
    }

    const modelId = options.model || 'gemini-pro';
    const payload = {
      instances: [
        {
          messages: [
            {
              role: 'user',
              content: message
            }
          ]
        }
      ],
      parameters: {
        maxOutputTokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7
      }
    };

    try {
      const response = await this.client.post(
        `/projects/${this.projectId}/locations/${this.location}/publishers/google/models/${modelId}:predict`,
        payload
      );
      
      return {
        content: response.data.predictions[0].candidates[0].content.parts[0].text,
        usage: response.data.predictions[0].usageMetadata,
        model: modelId
      };
    } catch (error) {
      throw new Error(`Google Vertex AI API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Check if the provider is available
   * @returns {boolean} True if credentials are available
   */
  isAvailable() {
    return !!(this.apiKey && this.projectId);
  }

  /**
   * Get available models
   * @returns {Array<string>} List of available models
   */
  getAvailableModels() {
    return [
      'gemini-pro',
      'gemini-pro-vision',
      'text-bison',
      'chat-bison'
    ];
  }
}

module.exports = GoogleProvider;
