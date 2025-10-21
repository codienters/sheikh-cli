# Changelog

All notable changes to Sheikh-CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Enhanced Test Coverage**: Added comprehensive unit tests for uncovered code paths
- **Integration Test Suite**: Added integration tests for core functionality
- **JSDoc Documentation**: Added comprehensive JSDoc comments throughout the codebase
- **Mock Test Data**: Created mock skill and agent files for testing
- **Robust Error Handling**: Enhanced error handling in agentic engine for undefined content

### Changed
- **Test Infrastructure**: Refactored Jest mocking to use `jest.doMock` for better module isolation
- **Agentic Engine**: Made `extractPatterns` and `analyzeFile` methods more robust for test environments
- **Skills Manager**: Enhanced error handling for skill execution failures
- **README Documentation**: Updated package name and repository URLs, fixed merge conflicts

### Fixed
- **Test Failures**: Fixed multiple test failures related to mocking and assertions
- **Map Object Handling**: Corrected test assertions to handle Map objects returned by managers
- **Encoding Issues**: Fixed expected encoding format in test assertions
- **Merge Conflicts**: Resolved merge conflicts in README.md
- **Undefined Content**: Fixed TypeError issues when processing undefined content in tests

### Technical Improvements
- **Module Cache Management**: Added proper module cache clearing in tests
- **Mock Function Definitions**: Improved mock function definitions for better test reliability
- **Test Data Consistency**: Ensured test data matches expected formats and values
- **Error Message Validation**: Enhanced error message validation in tests

## [2.0.0] - 2025-01-27

### Added
- **Agentic Engine**: Complete rewrite with advanced agentic capabilities
- **Codebase Analyzer**: Intelligent codebase analysis and indexing
- **Multi-File Coordination**: Coordinate changes across multiple files
- **Visual Diff System**: Preview changes before applying them
- **Workflow Generation**: Generate workflows from natural language descriptions
- **Enhanced Search**: Agentic search across entire codebase
- **Production-Grade Agents**: 8 specialized agents for different tasks
- **Approval System**: Visual diff and approval workflow for changes
- **Agent Coordinator**: Intelligent task planning and execution
- **Comprehensive Test Suite**: Unit tests, integration tests, and mocking
- **Enhanced Documentation**: Updated README with agentic features
- **API Documentation**: JSDoc comments throughout the codebase
- **TypeScript Support**: Full TypeScript configuration and build system
- **Build System**: Automated build process with asset copying and packaging
- **Third-Party Notices**: Complete third-party software notices and licenses
- **Enhanced CLI Commands**: New commands for search, analyze, workflow, and agents
- **GitHub Actions CI/CD**: Comprehensive CI/CD pipeline with agentic testing
- **NPM Publishing**: Ready for npm publication with proper scope configuration

### Changed
- **Architecture**: Complete rewrite with agentic engine architecture
- **CLI Interface**: Enhanced with new agentic commands (`search`, `analyze`, `workflow`)
- **Configuration**: Updated configuration format for agentic features
- **Provider System**: Improved provider management and initialization
- **Skills System**: Enhanced skills loading and execution
- **Agents System**: Improved agent management and validation

### Fixed
- **Test Coverage**: Fixed failing tests and improved test reliability
- **Error Handling**: Better error handling and validation throughout
- **Configuration Validation**: Improved configuration validation logic
- **File System Operations**: Better handling of file operations and cleanup

### Removed
- **Legacy Features**: Removed outdated features in favor of agentic capabilities

## [1.1.0] - 2025-10-21

### Added
- **Comprehensive Testing Suite**: Added unit tests for CLI, config, providers, skills, and agents
- **Integration Tests**: Added end-to-end integration tests for configuration flow, provider initialization, skill loading, and MCP server configuration
- **Enhanced Documentation**: Updated README.md with detailed testing instructions, project structure, and API references
- **Jest Configuration**: Improved Jest setup with custom test utilities, environment mocking, and coverage reporting
- **API Documentation**: Added JSDoc comments to core modules (providers, config, skills managers)
- **Test Utilities**: Created shared test utilities and mocking helpers in `jest.setup.js`

### Changed
- Updated README.md to reflect current repository URL (`codienters/sheikh-cli`)
- Enhanced development workflow documentation with testing commands and project structure
- Improved changelog format and added version history

### Fixed
- Corrected repository URLs in documentation and configuration examples
- Fixed Jest test imports to avoid ES module conflicts

## [Unreleased]

### Added
- Initial release of Sheikh-CLI
- Multi-provider AI support (Anthropic, OpenAI, AWS Bedrock, Google Vertex AI, Ollama)
- Custom skills system for task-specific capabilities
- AI agents system for specialized subagents
- MCP (Model Context Protocol) integration
- Auto-approval settings for automation
- Custom instructions support
- Workspace configuration
- Interactive chat interface
- Configuration management commands
- Environment variable support for API keys
- Comprehensive documentation and examples

### Features
- **Multi-Provider Support**: Works with Anthropic Claude, OpenAI GPT, AWS Bedrock, Google Vertex AI, and Ollama
- **Skills System**: Create and use specialized skills for specific tasks
- **Agents System**: Deploy specialized AI subagents with custom prompts and tools
- **MCP Integration**: Model Context Protocol support for enhanced capabilities
- **Auto-Approval**: Configurable auto-approval settings for seamless automation
- **Custom Instructions**: Task-specific instructions for better AI responses
- **Workspace Support**: Custom workspace directory configuration
- **Secure Configuration**: Environment variable-based API key management

### CLI Commands
- `sheikh chat` - Start interactive chat session
- `sheikh config` - Manage configuration
- `sheikh agents` - Manage AI agents
- `sheikh skills` - Manage skills

### Interactive Commands
- `/agents` - List available agents
- `/skills` - List available skills
- `/config` - Show current configuration
- `/clear` - Clear conversation history
- `/history` - Show conversation history

### Configuration
- JSON-based configuration file (`.sheikh/config.json`)
- Environment variable support for all API keys
- Provider-specific configuration options
- Auto-approval settings
- Custom model selection

### Documentation
- Comprehensive README with installation and usage instructions
- GitHub Copilot instructions for code generation
- Example skills and agents
- Configuration examples for all providers
- Contributing guidelines
- Security best practices

### Testing
- Unit tests for core functionality
- Integration tests for providers
- Configuration validation tests
- Skills and agents management tests

### Development
- ESLint configuration for code quality
- Prettier configuration for code formatting
- Jest configuration for testing
- GitHub Actions CI/CD pipeline
- Automated testing and security scanning
