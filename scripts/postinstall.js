#!/usr/bin/env node

/**
 * Sheikh-CLI Post-Install Script
 * Handles post-installation setup and configuration
 */

const fs = require('fs-extra');
const path = require('path');
const os = require('os');

class PostInstallScript {
  constructor() {
    this.homeDir = os.homedir();
    this.configDir = path.join(this.homeDir, '.sheikh');
    this.claudeDir = path.join(this.homeDir, '.claude');
  }

  async run() {
    console.log('🚀 Running Sheikh-CLI post-install setup...');
    
    try {
      await this.createDirectories();
      await this.createDefaultConfig();
      await this.createDefaultAgents();
      await this.createDefaultSkills();
      await this.displayWelcomeMessage();
      
      console.log('✅ Post-install setup completed successfully!');
    } catch (error) {
      console.error('❌ Post-install setup failed:', error.message);
      process.exit(1);
    }
  }

  async createDirectories() {
    console.log('📁 Creating configuration directories...');
    
    const directories = [
      this.configDir,
      path.join(this.configDir, 'logs'),
      path.join(this.configDir, 'cache'),
      this.claudeDir,
      path.join(this.claudeDir, 'agents'),
      path.join(this.claudeDir, 'skills')
    ];

    for (const dir of directories) {
      await fs.ensureDir(dir);
    }
  }

  async createDefaultConfig() {
    console.log('⚙️ Creating default configuration...');
    
    const configPath = path.join(this.configDir, 'config.json');
    
    if (!await fs.pathExists(configPath)) {
      const defaultConfig = {
        globalState: {
          apiProvider: 'anthropic',
          apiModelId: 'claude-3-5-sonnet-20241022',
          agenticEnabled: true,
          autoApprovalSettings: {
            enabled: false,
            actions: {
              readFiles: true,
              editFiles: false,
              executeSafeCommands: true,
              useMcp: false
            },
            maxRequests: 20
          }
        },
        settings: {
          'cline.enableCheckpoints': false,
          'agentic.visualDiff': true,
          'agentic.coordinateChanges': true,
          'agentic.autoApprove': false
        }
      };

      await fs.writeJson(configPath, defaultConfig, { spaces: 2 });
    }
  }

  async createDefaultAgents() {
    console.log('🤖 Setting up default agents...');
    
    const agentsDir = path.join(this.claudeDir, 'agents');
    
    // Create debugger agent
    const debuggerAgent = `---
name: debugger
description: Debugging specialist for errors, test failures, and unexpected behavior
tools: Read, Edit, Bash, Grep, Glob
model: inherit
---

# Debugger Agent

You are a debugging specialist focused on identifying and resolving errors, test failures, and unexpected behavior in code.

## Instructions

When invoked, you should:

1. **Analyze the Error**: Examine error messages, stack traces, and context
2. **Identify Root Cause**: Determine the underlying issue causing the problem
3. **Propose Solutions**: Suggest specific fixes with code examples
4. **Test Solutions**: Verify that proposed solutions work
5. **Prevent Recurrence**: Suggest preventive measures

## Guidelines

- Always read error messages carefully
- Check related files and dependencies
- Consider edge cases and boundary conditions
- Provide clear, actionable solutions
- Test fixes before recommending them
- Document the debugging process

## Output Format

- Clear problem description
- Root cause analysis
- Step-by-step solution
- Code examples
- Testing recommendations
- Prevention strategies
`;

    await fs.writeFile(path.join(agentsDir, 'debugger.md'), debuggerAgent);

    // Create test-runner agent
    const testRunnerAgent = `---
name: test-runner
description: Test automation expert for running tests and fixing failures
tools: Bash, Read, Edit, Grep, Glob
model: inherit
---

# Test Runner Agent

You are a test automation expert focused on running tests, analyzing failures, and ensuring code quality.

## Instructions

When invoked, you should:

1. **Run Tests**: Execute appropriate test suites
2. **Analyze Failures**: Investigate test failures and errors
3. **Fix Issues**: Resolve test problems and improve coverage
4. **Optimize Performance**: Improve test execution speed
5. **Maintain Quality**: Ensure tests remain reliable and maintainable

## Guidelines

- Run tests in appropriate environments
- Analyze failure patterns and trends
- Fix flaky tests and improve reliability
- Optimize test performance
- Maintain good test coverage
- Follow testing best practices

## Output Format

- Test execution results
- Failure analysis
- Fix recommendations
- Performance improvements
- Coverage reports
- Best practice suggestions
`;

    await fs.writeFile(path.join(agentsDir, 'test-runner.md'), testRunnerAgent);
  }

  async createDefaultSkills() {
    console.log('🛠️ Setting up default skills...');
    
    const skillsDir = path.join(this.claudeDir, 'skills');
    
    // Create git-helper skill
    const gitHelperSkill = `# Git Helper Skill

This skill provides Git workflow assistance and best practices.

## Capabilities

- Git workflow guidance
- Commit message generation
- Branch management
- Merge conflict resolution
- Repository setup and configuration

## Usage

\`\`\`bash
sheikh skills --use git-helper "create feature branch"
sheikh skills --use git-helper "generate commit message"
\`\`\`

## Examples

- Create feature branch: \`git checkout -b feature/new-feature\`
- Generate commit message: \`git commit -m "feat: add new feature"\`
- Resolve merge conflicts: \`git mergetool\`
`;

    await fs.ensureDir(path.join(skillsDir, 'git-helper'));
    await fs.writeFile(path.join(skillsDir, 'git-helper', 'SKILL.md'), gitHelperSkill);
  }

  async displayWelcomeMessage() {
    console.log(`
🎉 Sheikh-CLI has been successfully installed!

📁 Configuration created at: ${this.configDir}
🤖 Agents available at: ${path.join(this.claudeDir, 'agents')}
🛠️ Skills available at: ${path.join(this.claudeDir, 'skills')}

🚀 Quick Start:
  1. Set your API key: export API_KEY="your-api-key"
  2. Initialize config: sheikh config --init
  3. Start chatting: sheikh chat

📚 Documentation:
  - README: https://github.com/codienters/sheikh-cli#readme
  - Agents: https://github.com/codienters/sheikh-cli/blob/main/AGENTS.md
  - GitHub Actions: https://github.com/codienters/sheikh-cli/blob/main/docs/github-actions-setup.md

🆘 Need help? Open an issue: https://github.com/codienters/sheikh-cli/issues

Happy coding! 🚀
`);
  }
}

// Run post-install if called directly
if (require.main === module) {
  const script = new PostInstallScript();
  script.run();
}

module.exports = PostInstallScript;
