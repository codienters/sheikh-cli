# Contributing to Sheikh-CLI

Thank you for your interest in contributing to Sheikh-CLI! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/sheikh-cli.git
   cd sheikh-cli
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Add your API keys
   export API_KEY="your-anthropic-api-key"
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## 🔧 Development Workflow

### Branch Strategy

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/***: Feature development branches
- **hotfix/***: Critical bug fixes

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Add tests for new functionality
   - Update documentation as needed

3. **Run quality checks**
   ```bash
   npm run lint
   npm run format
   npm test
   npm run test:coverage
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create PR on GitHub
   ```

## 📝 Code Standards

### JavaScript/Node.js

- Follow ESLint configuration
- Use Prettier for formatting
- Write comprehensive tests
- Document public APIs
- Use semantic commit messages

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Build/tooling changes

**Examples:**
```
feat(agents): add new debugger agent
fix(providers): resolve OpenAI API timeout issue
docs(readme): update installation instructions
```

### Testing Requirements

- **Unit Tests**: Test individual functions/modules
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete workflows
- **Coverage**: Maintain >80% test coverage

### Code Review Process

1. **Automated Checks**: All PRs must pass CI/CD pipeline
2. **Code Review**: At least one maintainer approval required
3. **Testing**: All tests must pass
4. **Documentation**: Update docs for user-facing changes

## 🤖 Agent Development

### Creating Custom Agents

1. **Create agent file**
   ```bash
   # Project-level agent
   touch .claude/agents/my-agent.md
   
   # User-level agent
   touch ~/.claude/agents/my-agent.md
   ```

2. **Define agent configuration**
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

3. **Test your agent**
   ```bash
   sheikh agents --list
   sheikh chat "Use the my-agent to help with..."
   ```

### Agent Best Practices

- **Single Responsibility**: Each agent should have a clear, focused purpose
- **Clear Instructions**: Provide detailed, actionable instructions
- **Tool Limitations**: Only grant necessary tools to agents
- **Model Selection**: Choose appropriate model for agent's needs

## 🛠️ Skill Development

### Creating Custom Skills

1. **Create skill directory**
   ```bash
   mkdir -p .claude/skills/my-skill
   ```

2. **Create skill file**
   ```markdown
   # My Skill
   
   This skill provides [description].
   
   ## Capabilities
   - Capability 1
   - Capability 2
   
   ## Usage
   \`\`\`bash
   sheikh skills --use my-skill "command"
   \`\`\`
   ```

3. **Test your skill**
   ```bash
   sheikh skills --list
   sheikh skills --use my-skill "test command"
   ```

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues
2. Try latest version
3. Reproduce the issue
4. Check logs for errors

### Bug Report Template

```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 10, macOS 12, Ubuntu 20.04]
- Node.js: [e.g., 18.17.0]
- Sheikh-CLI: [e.g., 2.0.1]

## Additional Context
Any other relevant information
```

## 💡 Feature Requests

### Before Requesting

1. Check existing feature requests
2. Consider if it fits project scope
3. Think about implementation complexity
4. Consider user impact

### Feature Request Template

```markdown
## Feature Description
Brief description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should this feature work?

## Alternatives Considered
What other approaches were considered?

## Additional Context
Any other relevant information
```

## 🔒 Security

### Reporting Security Issues

**DO NOT** create public issues for security vulnerabilities.

Instead:
1. Email: security@sheikh-cli.dev
2. Include detailed description
3. Provide reproduction steps
4. Wait for response before disclosure

### Security Guidelines

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Follow security best practices
- Report vulnerabilities responsibly

## 📊 Performance

### Performance Guidelines

- Optimize for speed and memory usage
- Profile code before optimization
- Consider caching strategies
- Monitor performance metrics

### Performance Testing

```bash
# Run performance tests
npm run test:performance

# Profile memory usage
npm run test:memory

# Benchmark execution time
npm run test:benchmark
```

## 🌍 Internationalization

### Adding New Languages

1. Create language files
2. Update documentation
3. Test translations
4. Update CI/CD for new languages

### Translation Guidelines

- Use clear, concise language
- Maintain consistency with existing translations
- Test with native speakers
- Follow cultural conventions

## 📚 Documentation

### Documentation Standards

- Write clear, concise documentation
- Include code examples
- Keep documentation up to date
- Use consistent formatting

### Documentation Types

- **README**: Project overview and quick start
- **API Docs**: Complete API reference
- **Guides**: Step-by-step tutorials
- **Examples**: Code examples and use cases

## 🎯 Release Process

### Version Management

- Follow semantic versioning (semver)
- Update CHANGELOG.md for each release
- Tag releases with version numbers
- Publish to NPM automatically

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped
- [ ] Release notes prepared
- [ ] NPM package published
- [ ] GitHub release created

## 🤝 Community

### Getting Help

- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Community discussions and questions
- **Discord**: Real-time chat and support
- **Email**: support@sheikh-cli.dev

### Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Share knowledge and experiences
- Follow the code of conduct

## 📄 License

By contributing to Sheikh-CLI, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation
- Community highlights

Thank you for contributing to Sheikh-CLI! 🚀
