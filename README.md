# Sheikh-CLI

A powerful AI assistant CLI for developers with multi-provider support, custom skills, and agents.

## Features

- 🤖 **Multi-Provider Support**: Works with Anthropic, OpenAI, AWS Bedrock, Google Vertex AI, and Ollama
- 🛠️ **Custom Skills**: Create and use specialized skills for specific tasks
- 👥 **AI Agents**: Deploy specialized AI subagents for different workflows
- 🔧 **MCP Support**: Model Context Protocol integration for enhanced capabilities
- ⚡ **Auto-Approval**: Configurable auto-approval settings for seamless automation
- 🎯 **Custom Instructions**: Provide task-specific instructions for better results
- 📁 **Workspace Support**: Custom workspace directory configuration
- 🔒 **Secure**: Environment variable-based API key management

## Installation

### From npm (Recommended)

```bash
npm install -g sheikh-cli
```

### From Source

```bash
git clone https://github.com/your-username/sheikh-cli.git
cd sheikh-cli
npm install
npm link
```

## Quick Start

1. **Set up your API key**:
   ```bash
   export API_KEY="your-anthropic-api-key"
   # or
   export OPENAI_API_KEY="your-openai-api-key"
   ```

2. **Initialize configuration**:
   ```bash
   sheikh config --init
   ```

3. **Start chatting**:
   ```bash
   sheikh chat
   ```

## Configuration

Sheikh-CLI supports multiple AI providers through environment variables:

### Anthropic (Default)
```bash
export API_KEY="your-anthropic-api-key"
# or
export ANTHROPIC_API_KEY="your-anthropic-api-key"
```

### OpenAI
```bash
export OPENAI_API_KEY="your-openai-api-key"
# or
export OPENAI_NATIVE_API_KEY="your-openai-native-api-key"
```

### AWS Bedrock
```bash
export AWS_ACCESS_KEY_ID="your-aws-access-key"
export AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
export AWS_SESSION_TOKEN="your-aws-session-token"  # Optional
```

### Google Vertex AI
```bash
export GOOGLE_APPLICATION_CREDENTIALS="path/to/credentials.json"
# or
export GEMINI_API_KEY="your-gemini-api-key"
```

### Other Providers
```bash
export OPEN_ROUTER_API_KEY="your-openrouter-api-key"
export CLINE_API_KEY="your-cline-api-key"
export DEEP_SEEK_API_KEY="your-deepseek-api-key"
export REQUESTY_API_KEY="your-requesty-api-key"
export TOGETHER_API_KEY="your-together-api-key"
export QWEN_API_KEY="your-qwen-api-key"
export DOUBAO_API_KEY="your-doubao-api-key"
export MISTRAL_API_KEY="your-mistral-api-key"
export LITE_LLM_API_KEY="your-lite-llm-api-key"
export ASKSAGE_API_KEY="your-asksage-api-key"
export XAI_API_KEY="your-xai-api-key"
export SAMBANOVA_API_KEY="your-sambanova-api-key"
```

## Usage

### Basic Chat

```bash
sheikh chat
```

### Advanced Options

```bash
sheikh chat \
  --provider anthropic \
  --model claude-3-5-sonnet-20241022 \
  --full-auto \
  --auto-approve-mcp \
  --custom-instructions "Always write clean, documented code" \
  --workspace /path/to/your/project
```

### Configuration Management

```bash
# Initialize configuration
sheikh config --init

# Show current configuration
sheikh config --show

# Validate configuration
sheikh config --validate
```

### Skills and Agents

```bash
# List available skills
sheikh skills --list

# List available agents
sheikh agents --list

# Create a new agent (interactive)
sheikh agents --create my-agent
```

## Configuration File

Sheikh-CLI uses a JSON configuration file located at `.sheikh/config.json`:

```json
{
  "globalState": {
    "apiProvider": "anthropic",
    "apiModelId": "claude-3-5-sonnet-20241022",
    "autoApprovalSettings": {
      "enabled": true,
      "actions": {
        "readFiles": true,
        "editFiles": false,
        "executeSafeCommands": true,
        "useMcp": false
      },
      "maxRequests": 20
    }
  },
  "settings": {
    "cline.enableCheckpoints": false
  }
}
```

### Provider-Specific Configuration

#### Google Vertex AI
```json
{
  "globalState": {
    "apiProvider": "vertex",
    "apiModelId": "claude-3-5-sonnet@20250219",
    "vertexProjectId": "your-gcp-project-id",
    "vertexRegion": "us-central1"
  }
}
```

#### AWS Bedrock
```json
{
  "globalState": {
    "apiProvider": "aws",
    "apiModelId": "anthropic.claude-3-sonnet-20240229-v1:0",
    "awsRegion": "us-east-1"
  }
}
```

## Skills

Skills are specialized capabilities that Sheikh-CLI can use for specific tasks. Create skills in `.claude/skills/` or `~/.claude/skills/`.

### Creating a Skill

1. Create a directory for your skill:
   ```bash
   mkdir -p .claude/skills/my-skill
   ```

2. Create `SKILL.md` with YAML frontmatter:
   ```markdown
   ---
   name: My Skill
   description: A skill for specific tasks. Use when working with X or Y.
   ---

   # My Skill

   ## Instructions
   Detailed instructions for the skill.

   ## Examples
   - Example usage 1
   - Example usage 2
   ```

## Agents

Agents are specialized AI subagents with their own system prompts and capabilities. Create agents in `.claude/agents/` or `~/.claude/agents/`.

### Creating an Agent

1. Create an agent file:
   ```bash
   touch .claude/agents/my-agent.md
   ```

2. Define the agent with YAML frontmatter:
   ```markdown
   ---
   name: my-agent
   description: Expert in specific domain. Use proactively for X tasks.
   tools: Read, Write, Bash
   model: inherit
   ---

   # My Agent

   You are an expert in [domain]. When invoked:
   1. Analyze the request
   2. Provide specialized assistance
   3. Follow best practices

   ## Guidelines
   - Always validate input
   - Provide clear explanations
   - Follow security best practices
   ```

## Commands

### Interactive Commands

When in chat mode, use these commands:

- `help` - Show help message
- `exit` or `quit` - Exit the application
- `/agents` - List available agents
- `/skills` - List available skills
- `/config` - Show current configuration
- `/clear` - Clear conversation history
- `/history` - Show conversation history

## Development

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn

### Setup

```bash
git clone https://github.com/codienters/sheikh-cli.git
cd sheikh-cli
npm install
```

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Building

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm test`
6. Commit your changes: `git commit -am 'Add feature'`
7. Push to the branch: `git push origin feature-name`
8. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/your-username/sheikh-cli/wiki)
- 🐛 [Issue Tracker](https://github.com/your-username/sheikh-cli/issues)
- 💬 [Discussions](https://github.com/your-username/sheikh-cli/discussions)

## Changelog

### v1.0.0
- Initial release
- Multi-provider AI support
- Skills and agents system
- MCP integration
- Auto-approval settings
- Custom workspace support
