/**
 * Environment Utilities Module
 *
 * Handles environment setup and validation
 *
 * @module utils/environment
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

/**
 * Setup environment for Sheikh-CLI
 * @param {string} workspacePath - Custom workspace path
 * @returns {Promise<void>}
 */
async function setupEnvironment(workspacePath = null) {
  const workspace = workspacePath || process.cwd();
  
  // Ensure .sheikh directory exists
  const sheikhDir = path.join(workspace, '.sheikh');
  await fs.ensureDir(sheikhDir);
  
  // Ensure .claude directory exists
  const claudeDir = path.join(workspace, '.claude');
  await fs.ensureDir(claudeDir);
  
  // Ensure subdirectories exist
  await fs.ensureDir(path.join(claudeDir, 'agents'));
  await fs.ensureDir(path.join(claudeDir, 'skills'));
  
  console.log(chalk.green('Environment setup complete'));
}

/**
 * Validate environment variables
 * @returns {Object} Validation result with available and optional variables
 */
function validateEnvironmentVariables() {
  const envVars = {
    // Anthropic
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || process.env.API_KEY,
    
    // OpenAI
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    
    // AWS
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION,
    
    // Google
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
    GOOGLE_LOCATION: process.env.GOOGLE_LOCATION,
    
    // Ollama
    OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL
  };

  const available = [];
  const optional = [];

  for (const [key, value] of Object.entries(envVars)) {
    if (value) {
      available.push(key);
    } else {
      optional.push(key);
    }
  }

  return {
    available,
    optional,
    all: Object.keys(envVars)
  };
}

/**
 * Check if a specific provider is available
 * @param {string} provider - Provider name
 * @returns {boolean} True if provider is available
 */
function isProviderAvailable(provider) {
  const envValidation = validateEnvironmentVariables();
  
  switch (provider.toLowerCase()) {
    case 'anthropic':
      return envValidation.available.includes('ANTHROPIC_API_KEY');
    case 'openai':
      return envValidation.available.includes('OPENAI_API_KEY');
    case 'aws':
      return envValidation.available.includes('AWS_ACCESS_KEY_ID') && 
             envValidation.available.includes('AWS_SECRET_ACCESS_KEY');
    case 'google':
      return envValidation.available.includes('GOOGLE_API_KEY') && 
             envValidation.available.includes('GOOGLE_PROJECT_ID');
    case 'ollama':
      return true; // Ollama doesn't require API keys
    default:
      return false;
  }
}

/**
 * Get available providers
 * @returns {Array<string>} List of available providers
 */
function getAvailableProviders() {
  const providers = ['anthropic', 'openai', 'aws', 'google', 'ollama'];
  return providers.filter(provider => isProviderAvailable(provider));
}

/**
 * Display environment status
 * @returns {void}
 */
function displayEnvironmentStatus() {
  const envValidation = validateEnvironmentVariables();
  
  console.log(chalk.blue('\n🔧 Environment Status:'));
  
  if (envValidation.available.length > 0) {
    console.log(chalk.green('✅ Available API Keys:'));
    envValidation.available.forEach(key => {
      console.log(chalk.gray(`  • ${key}`));
    });
  }
  
  if (envValidation.optional.length > 0) {
    console.log(chalk.yellow('⚠️  Optional API Keys (not set):'));
    envValidation.optional.forEach(key => {
      console.log(chalk.gray(`  • ${key}`));
    });
  }
  
  const availableProviders = getAvailableProviders();
  if (availableProviders.length > 0) {
    console.log(chalk.green('\n✅ Available Providers:'));
    availableProviders.forEach(provider => {
      console.log(chalk.gray(`  • ${provider}`));
    });
  } else {
    console.log(chalk.red('\n❌ No providers available'));
    console.log(chalk.yellow('Please set at least one API key environment variable'));
  }
}

/**
 * Create environment template file
 * @param {string} workspacePath - Workspace path
 * @returns {Promise<void>}
 */
async function createEnvironmentTemplate(workspacePath = null) {
  const workspace = workspacePath || process.cwd();
  const envTemplatePath = path.join(workspace, '.env.example');
  
  const template = `# Sheikh-CLI Environment Variables
# Copy this file to .env and fill in your API keys

# Anthropic (Claude)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
API_KEY=your_anthropic_api_key_here

# OpenAI (GPT)
OPENAI_API_KEY=your_openai_api_key_here

# AWS Bedrock
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_DEFAULT_REGION=us-east-1

# Google Vertex AI
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_PROJECT_ID=your_google_project_id_here
GOOGLE_LOCATION=us-central1

# Ollama (Local)
OLLAMA_BASE_URL=http://localhost:11434
`;

  await fs.writeFile(envTemplatePath, template);
  console.log(chalk.green('Environment template created at:'), envTemplatePath);
}

module.exports = {
  setupEnvironment,
  validateEnvironmentVariables,
  isProviderAvailable,
  getAvailableProviders,
  displayEnvironmentStatus,
  createEnvironmentTemplate
};
