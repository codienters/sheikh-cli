# Sheikh-CLI Development Guide

This document provides comprehensive information about Sheikh-CLI dependencies, commands, architecture, and development workflows.

## Table of Contents
- [Dependencies](#dependencies)
- [Commands](#commands)
- [Architecture](#architecture)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Deployment](#deployment)
- [Agents](#agents)

## Dependencies

### Core Dependencies
```json
{
  "commander": "^11.1.0",           // CLI framework
  "dotenv": "^16.3.1",              // Environment variable management
  "chalk": "^4.1.2",                // Terminal styling
  "ora": "^5.4.1",                  // Loading spinners
  "inquirer": "^8.2.6",             // Interactive prompts
  "axios": "^1.6.2",                // HTTP requests
  "fs-extra": "^11.1.1",            // Enhanced file system operations
  "yaml": "^2.3.4",                 // YAML parsing
  "glob": "^10.3.10"                // File pattern matching
}
```

### AI Provider Dependencies
```json
{
  "@anthropic-ai/sdk": "^0.9.1",    // Anthropic Claude API
  "openai": "^4.20.1",              // OpenAI API
  "aws-sdk": "^2.1490.0",           // AWS Bedrock
  "@google-cloud/aiplatform": "^1.38.0"  // Google Vertex AI
}
```

### Development Dependencies
```json
{
  "nodemon": "^3.0.2",              // Development server
  "jest": "^29.7.0",                // Testing framework
  "eslint": "^8.54.0",              // Code linting
  "prettier": "^3.1.0"              // Code formatting
}
```

### Environment Variables
```bash
# Anthropic
API_KEY="your-anthropic-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"
OPENAI_NATIVE_API_KEY="your-openai-native-api-key"

# AWS Bedrock
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_SESSION_TOKEN="your-aws-session-token"
AWS_DEFAULT_REGION="us-east-1"

# Google Vertex AI
GOOGLE_APPLICATION_CREDENTIALS="path/to/credentials.json"
GEMINI_API_KEY="your-gemini-api-key"

# Other Providers
OPEN_ROUTER_API_KEY="your-openrouter-api-key"
CLINE_API_KEY="your-cline-api-key"
DEEP_SEEK_API_KEY="your-deepseek-api-key"
REQUESTY_API_KEY="your-requesty-api-key"
TOGETHER_API_KEY="your-together-api-key"
QWEN_API_KEY="your-qwen-api-key"
DOUBAO_API_KEY="your-doubao-api-key"
MISTRAL_API_KEY="your-mistral-api-key"
LITE_LLM_API_KEY="your-lite-llm-api-key"
ASKSAGE_API_KEY="your-asksage-api-key"
XAI_API_KEY="your-xai-api-key"
SAMBANOVA_API_KEY="your-sambanova-api-key"
```

## Commands

### CLI Commands
```bash
# Start interactive chat session
sheikh chat [options]

# Manage configuration
sheikh config --init                    # Initialize configuration
sheikh config --show                    # Show current configuration
sheikh config --validate                # Validate configuration

# Manage agents
sheikh agents --list                    # List available agents
sheikh agents --create <name>           # Create new agent
sheikh agents --delete <name>           # Delete agent

# Manage skills
sheikh skills --list                    # List available skills
```

### Chat Command Options
```bash
sheikh chat \
  --provider <provider>                 # AI provider to use
  --model <model>                       # Model to use
  --full-auto                          # Run in fully automated mode
  --auto-approve-mcp                   # Auto-approve MCP tool usage
  --custom-instructions <text>         # Custom instructions
  --workspace <path>                   # Custom workspace directory
```

### Interactive Commands
```bash
# In chat mode
help                                   # Show help message
exit/quit                             # Exit application
/agents                               # List available agents
/skills                               # List available skills
/config                               # Show current configuration
/clear                                # Clear conversation history
/history                              # Show conversation history
```

### Development Commands
```bash
npm start                             # Start the application
npm run dev                           # Start in development mode
npm test                              # Run tests
npm run lint                          # Run linter
npm run format                        # Format code
npm install                           # Install dependencies
```

## Architecture

### Project Structure
```
src/
├── cli.js                            # Main CLI entry point
├── sheikh-cli.js                     # Core application logic
├── config.js                         # Configuration management
├── providers/                        # AI provider implementations
│   ├── index.js                      # Provider manager
│   ├── base.js                       # Abstract base class
│   ├── anthropic.js                  # Anthropic Claude
│   ├── openai.js                     # OpenAI GPT
│   ├── aws.js                        # AWS Bedrock
│   ├── google.js                     # Google Vertex AI
│   └── ollama.js                     # Local Ollama
├── skills/                           # Skills management
│   └── index.js                      # Skills loader & executor
├── agents/                           # Agents management
│   └── index.js                      # Agents loader & executor
├── mcp/                              # MCP integration
│   └── index.js                      # MCP server management
├── utils/                            # Utility functions
│   ├── environment.js                # Environment setup
│   ├── approval.js                   # Auto-approval logic
│   └── instructions.js               # Custom instructions
└── __tests__/                        # Test suite
    ├── config.test.js                # Configuration tests
    ├── providers.test.js             # Provider tests
    └── skills.test.js                # Skills tests
```

### Configuration Files
```
.sheikh/
├── config.json                       # Project configuration
└── mcp.json                          # MCP server configuration

.claude/
├── skills/                           # Project skills
│   ├── code-review/
│   │   └── SKILL.md
│   └── git-helper/
│       └── SKILL.md
└── agents/                           # Project agents
    ├── debugger.md
    ├── test-runner.md
    └── data-scientist.md

~/.claude/                            # User-level configuration
├── skills/                           # User skills
└── agents/                           # User agents
```

### Core Classes

#### AIProviderManager
- Manages multiple AI providers
- Handles provider selection and initialization
- Provides unified interface for all providers

#### SkillsManager
- Loads and manages custom skills
- Handles skill discovery and matching
- Executes skills with appropriate context

#### AgentsManager
- Manages AI subagents
- Handles agent loading and execution
- Provides context isolation for agents

#### ConfigManager
- Manages configuration loading and validation
- Handles environment variable processing
- Provides configuration hierarchy

## Development Workflow

### Setup
```bash
# Clone repository
git clone <repository-url>
cd sheikh-cli

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Initialize configuration
npm run config:init
```

### Development
```bash
# Start development server
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format

# Run all checks
npm run check
```

### Code Quality
- **ESLint**: Enforces coding standards
- **Prettier**: Ensures consistent formatting
- **Jest**: Provides comprehensive testing
- **Git Hooks**: Pre-commit validation

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/feature-name
```

## Testing

### Test Structure
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- config.test.js
```

### Test Categories
- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **End-to-End Tests**: Complete workflow testing

### Mocking Strategy
- **External APIs**: All AI provider APIs are mocked
- **File System**: File operations are mocked in tests
- **Environment**: Environment variables are mocked

## Deployment

### Build Process
```bash
# Build for production
npm run build

# Run production build
npm start

# Package for distribution
npm pack
```

### CI/CD Pipeline
- **GitHub Actions**: Automated testing and deployment
- **NPM Publishing**: Automated package publishing
- **Version Management**: Automated version bumping

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
API_KEY=your-production-api-key
LOG_LEVEL=info
```

## Agents

For detailed information about available agents and their capabilities, see [AGENTS.md](AGENTS.md).

### Quick Agent Reference
- **debugger**: Error analysis and debugging
- **test-runner**: Test automation and failure analysis
- **data-scientist**: SQL analysis and data processing
- **code-reviewer**: Code quality and security review
- **git-helper**: Git operations and workflow assistance

### Agent Usage
```bash
# List available agents
/agents

# Use specific agent
Use the debugger agent to analyze this error

# Create custom agent
sheikh agents --create my-agent
```

## Troubleshooting

### Common Issues

#### Configuration Issues
```bash
# Validate configuration
sheikh config --validate

# Reset configuration
rm .sheikh/config.json
sheikh config --init
```

#### Provider Issues
```bash
# Check environment variables
env | grep API_KEY

# Test provider connection
sheikh chat --provider anthropic
```

#### Agent/Skill Issues
```bash
# Reload agents and skills
# Restart the CLI application

# Check file permissions
ls -la .claude/agents/
ls -la .claude/skills/
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=sheikh:* sheikh chat

# Verbose output
sheikh chat --verbose
```

### Log Files
- **Application Logs**: `~/.sheikh/logs/`
- **Error Logs**: `~/.sheikh/logs/error.log`
- **Debug Logs**: `~/.sheikh/logs/debug.log`

## Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

### Code Standards
- Follow ESLint configuration
- Write comprehensive tests
- Document public APIs
- Follow semantic versioning

### Pull Request Process
1. Ensure all tests pass
2. Update documentation if needed
3. Add changelog entry
4. Request review from maintainers
5. Address feedback and merge

## Support

### Documentation
- **README.md**: User documentation
- **AGENTS.md**: Agent documentation
- **API Documentation**: Inline code documentation

### Community
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Community discussions and questions
- **Wiki**: Additional documentation and guides

### Contact
- **Maintainer**: Sheikh-CLI Team
- **Email**: support@sheikh-cli.dev
- **GitHub**: https://github.com/sheikh-cli/sheikh-cli
