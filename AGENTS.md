# Sheikh-CLI Agents

This document describes the available AI agents and their capabilities in Sheikh-CLI.

## Available Agents

### Debugger Agent
- **Name**: `debugger`
- **Description**: Debugging specialist for errors, test failures, and unexpected behavior
- **Use Cases**: 
  - When encountering errors or exceptions
  - When tests are failing
  - When experiencing unexpected behavior
  - When performance issues arise
  - When investigating system problems
- **Tools**: Read, Edit, Bash, Grep, Glob
- **Model**: inherit

### Test Runner Agent
- **Name**: `test-runner`
- **Description**: Test automation expert for running tests and fixing failures
- **Use Cases**:
  - After code changes are made
  - When tests are failing
  - When setting up test suites
  - When debugging test issues
  - When optimizing test performance
- **Tools**: Bash, Read, Edit, Grep, Glob
- **Model**: inherit

### Data Scientist Agent
- **Name**: `data-scientist`
- **Description**: Data analysis expert for SQL queries, data processing, and insights
- **Use Cases**:
  - When working with databases and SQL
  - When analyzing data sets
  - When creating reports and visualizations
  - When performing statistical analysis
  - When processing large data files
  - When working with data pipelines
- **Tools**: Bash, Read, Write
- **Model**: sonnet

### Code Reviewer Agent
- **Name**: `code-reviewer`
- **Description**: Expert code review specialist for quality, security, and maintainability
- **Use Cases**:
  - Reviewing code for quality issues
  - Security auditing
  - Performance analysis
  - Best practices enforcement
  - Pull request reviews
- **Tools**: Read, Grep, Glob, Bash
- **Model**: inherit

### Git Helper Agent
- **Name**: `git-helper`
- **Description**: Git operations expert for repository management and best practices
- **Use Cases**:
  - Git workflow assistance
  - Commit message generation
  - Branch management
  - Merge conflict resolution
  - Repository setup and configuration
- **Tools**: Bash, Read, Write
- **Model**: inherit

## Agent Configuration

### YAML Frontmatter Format
```yaml
---
name: agent-name
description: Brief description of agent purpose
tools: tool1, tool2, tool3
model: inherit|sonnet|opus|haiku
---
```

### Agent System Prompt Structure
- **Role Definition**: Clear definition of the agent's role
- **Instructions**: Step-by-step process for task execution
- **Guidelines**: Best practices and constraints
- **Output Format**: Expected response structure
- **Examples**: Usage examples and patterns

## Creating Custom Agents

### 1. Create Agent File
```bash
# Project-level agent
touch .claude/agents/my-agent.md

# User-level agent
touch ~/.claude/agents/my-agent.md
```

### 2. Define Agent Configuration
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

### 3. Agent Discovery
- Agents are automatically discovered from `.claude/agents/` and `~/.claude/agents/`
- Project-level agents take precedence over user-level agents
- Changes take effect on next CLI startup

## Agent Execution Flow

1. **Input Processing**: Parse user message and context
2. **Agent Selection**: Match message to appropriate agent
3. **Context Preparation**: Prepare agent-specific context
4. **Tool Access**: Grant tools based on agent configuration
5. **Execution**: Run agent with system prompt and tools
6. **Response Formatting**: Format and return results

## Best Practices

### Agent Design
- **Single Responsibility**: Each agent should have a clear, focused purpose
- **Clear Instructions**: Provide detailed, actionable instructions
- **Tool Limitations**: Only grant necessary tools to agents
- **Model Selection**: Choose appropriate model for agent's needs

### System Prompts
- **Role Clarity**: Clearly define the agent's role and expertise
- **Process Definition**: Outline step-by-step execution process
- **Output Standards**: Define expected response format
- **Error Handling**: Include error handling and edge case management

### Tool Management
- **Principle of Least Privilege**: Grant minimum necessary tools
- **Tool Documentation**: Document tool usage and limitations
- **Security Considerations**: Consider security implications of tool access
- **Performance Impact**: Consider tool execution performance

## Troubleshooting

### Agent Not Loading
- Check file location and naming
- Verify YAML frontmatter syntax
- Ensure file has `.md` extension
- Check file permissions

### Agent Not Matching
- Review agent description for relevant keywords
- Test with explicit agent invocation
- Check agent configuration
- Verify agent is properly loaded

### Agent Execution Issues
- Check tool permissions
- Verify model availability
- Review system prompt syntax
- Check for configuration errors
