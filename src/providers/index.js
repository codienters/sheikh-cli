/**
 * AI Provider Manager
 *
 * Manages multiple AI providers and provides a unified interface
 * for interacting with different AI services.
 *
 * @module providers/index
 */

const AnthropicProvider = require('./anthropic');
const OpenAIProvider = require('./openai');
const AWSProvider = require('./aws');
const GoogleProvider = require('./google');
const OllamaProvider = require('./ollama');

/**
 * ProviderManager class
 * Handles provider initialization, selection, and management
 */
class ProviderManager {
  /**
   * Creates a new ProviderManager instance
   */
  constructor() {
    this.providers = new Map();
    this._initializeProviders();
  }

  /**
   * Initialize all available providers
   * @private
   */
  _initializeProviders() {
    this.providers.set('anthropic', new AnthropicProvider());
    this.providers.set('openai', new OpenAIProvider());
    this.providers.set('aws', new AWSProvider());
    this.providers.set('google', new GoogleProvider());
    this.providers.set('ollama', new OllamaProvider());
  }

  /**
   * Get a provider by name
   *
   * @param {string} providerName - Name of the provider to retrieve
   * @returns {Object} Provider instance
   * @throws {Error} If provider is not found
   *
   * @example
   * const provider = providerManager.getProvider('anthropic');
   */
  getProvider(providerName) {
    const provider = this.providers.get(providerName.toLowerCase());
    if (!provider) {
      throw new Error(`Provider '${providerName}' not found. Available providers: ${this.listProviders().join(', ')}`);
    }
    return provider;
  }

  /**
   * List all available provider names
   *
   * @returns {string[]} Array of provider names
   *
   * @example
   * const providers = providerManager.listProviders();
   * // ['anthropic', 'openai', 'aws', 'google', 'ollama']
   */
  listProviders() {
    return Array.from(this.providers.keys());
  }

  /**
   * Check if a provider is available
   *
   * @param {string} providerName - Name of the provider to check
   * @returns {boolean} True if provider exists
   */
  hasProvider(providerName) {
    return this.providers.has(providerName.toLowerCase());
  }
}

// Export singleton instance
const providerManager = new ProviderManager();

module.exports = providerManager;