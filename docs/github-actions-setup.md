# GitHub Actions Setup Guide

This guide provides comprehensive instructions for setting up GitHub Actions workflows and repository secrets for Sheikh-CLI.

## 📋 Table of Contents

- [Overview](#overview)
- [Repository Secrets Setup](#repository-secrets-setup)
- [Workflow Configuration](#workflow-configuration)
- [Manual Triggers](#manual-triggers)
- [Monitoring & Troubleshooting](#monitoring--troubleshooting)
- [Best Practices](#best-practices)

## 🎯 Overview

Sheikh-CLI uses GitHub Actions for:
- **Continuous Integration**: Automated testing, linting, and building
- **Continuous Deployment**: Automated publishing to NPM and GitHub releases
- **Dependency Management**: Automated dependency updates and security patches
- **Quality Assurance**: Code quality checks and security audits

## 🔐 Repository Secrets Setup

### Required Secrets

#### 1. NPM_TOKEN
**Purpose**: Authenticate with NPM for package publishing

**Setup Steps**:
1. Login to NPM:
   ```bash
   npm login
   ```

2. Create a new token:
   ```bash
   npm token create --read-only=false
   ```

3. Copy the token (format: `npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

4. Add to GitHub:
   - Go to Repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: `npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Click "Add secret"

#### 2. GITHUB_TOKEN
**Purpose**: GitHub API authentication for releases and PRs

**Setup Steps**:
1. This token is automatically provided by GitHub Actions
2. No manual setup required
3. Used automatically in workflows via `${{ secrets.GITHUB_TOKEN }}`

### Optional Secrets

#### CODECOV_TOKEN
**Purpose**: Upload coverage reports to Codecov

**Setup Steps**:
1. Sign up at [codecov.io](https://codecov.io)
2. Connect your GitHub repository
3. Copy the repository token
4. Add to GitHub secrets as `CODECOV_TOKEN`

#### SLACK_WEBHOOK
**Purpose**: Send deployment notifications to Slack

**Setup Steps**:
1. Create a Slack app in your workspace
2. Enable Incoming Webhooks
3. Create a webhook URL
4. Add to GitHub secrets as `SLACK_WEBHOOK`

#### DISCORD_WEBHOOK
**Purpose**: Send release notifications to Discord

**Setup Steps**:
1. Go to Discord server settings
2. Integrations → Webhooks
3. Create a new webhook
4. Copy the webhook URL
5. Add to GitHub secrets as `DISCORD_WEBHOOK`

## ⚙️ Workflow Configuration

### Available Workflows

#### 1. CI Pipeline (`.github/workflows/ci.yml`)
**Triggers**: Push/PR to main/develop branches

**Features**:
- Lint and format checking
- Multi-version testing (Node.js 18.x, 20.x)
- Build validation
- Security audit
- Coverage reporting

**Jobs**:
- `lint`: ESLint and Prettier validation
- `test`: Test suite execution with coverage
- `build`: Build process validation
- `security`: Security vulnerability scanning

#### 2. Release Pipeline (`.github/workflows/release.yml`)
**Triggers**: Git tags, manual dispatch

**Features**:
- Semantic versioning
- Comprehensive testing
- NPM publishing
- GitHub release creation
- Changelog generation

**Jobs**:
- `prepare`: Version validation and preparation
- `build`: Build and package creation
- `publish-npm`: Publish to NPM registry
- `create-release`: Create GitHub release
- `notify`: Success notifications

#### 3. Agentic CI/CD (`.github/workflows/agentic-ci.yml`)
**Triggers**: Push/PR to main/develop branches

**Features**:
- Advanced codebase analysis
- Multi-agent testing coordination
- Enhanced security scanning
- Code quality metrics
- Automated deployment

**Jobs**:
- `agentic-analysis`: Codebase analysis
- `agentic-testing`: Multi-agent testing
- `security-audit`: Enhanced security audit
- `code-quality`: Code quality analysis
- `build`: Agentic build process
- `deploy`: Automated deployment
- `monitoring`: Deployment monitoring

#### 4. Dependency Updates (`.github/workflows/dependency-updates.yml`)
**Triggers**: Weekly schedule (Mondays 9 AM UTC), manual dispatch

**Features**:
- Automated dependency checking
- Security patch application
- Automated PR creation
- Update validation

**Jobs**:
- `check-updates`: Dependency update detection
- `create-update-pr`: Automated PR creation

## 🚀 Manual Triggers

### Release a New Version

#### Method 1: Git Tags
```bash
# Create a new tag
git tag v2.0.2

# Push the tag
git push origin v2.0.2

# This automatically triggers the release pipeline
```

#### Method 2: Manual Dispatch
1. Go to GitHub → Actions → Release Pipeline
2. Click "Run workflow"
3. Enter version number (e.g., `2.0.2`)
4. Click "Run workflow"

### Update Dependencies
1. Go to GitHub → Actions → Dependency Updates
2. Click "Run workflow"
3. Workflow will check for updates and create PRs if needed

### Run Agentic Analysis
1. Go to GitHub → Actions → Agentic CI/CD
2. Click "Run workflow"
3. Select environment (staging/production)
4. Click "Run workflow"

## 📊 Monitoring & Troubleshooting

### Workflow Status Monitoring

#### GitHub Actions Dashboard
- Go to Repository → Actions tab
- View all workflow runs
- Check individual job logs
- Monitor success/failure rates

#### Key Metrics to Monitor
- **Build Success Rate**: Should be >95%
- **Test Coverage**: Should be >80%
- **Security Issues**: Should be 0 high/critical
- **Deployment Time**: Should be <10 minutes

### Common Issues & Solutions

#### 1. NPM Publishing Fails
**Error**: `npm ERR! 403 Forbidden`

**Solutions**:
- Verify `NPM_TOKEN` secret is correctly set
- Check token permissions (should have publish access)
- Ensure package name matches repository name
- Check if version already exists

#### 2. Tests Failing
**Error**: Test suite failures

**Solutions**:
- Check test logs for specific failures
- Verify all dependencies are installed
- Check for environment-specific issues
- Review test configuration

#### 3. Security Audit Failures
**Error**: High/critical vulnerabilities found

**Solutions**:
- Review vulnerability details
- Update affected dependencies
- Check if vulnerabilities are false positives
- Consider security exceptions for known issues

#### 4. Build Failures
**Error**: Build process fails

**Solutions**:
- Check build logs for specific errors
- Verify all dependencies are compatible
- Check for missing environment variables
- Review build configuration

### Debugging Workflows

#### Enable Debug Logging
```yaml
# Add to workflow step
- name: Debug step
  run: echo "Debug information"
  env:
    ACTIONS_STEP_DEBUG: true
```

#### Check Secret Values
```yaml
# Verify secrets are available (without exposing values)
- name: Check secrets
  run: |
    if [ -n "${{ secrets.NPM_TOKEN }}" ]; then
      echo "NPM_TOKEN is set"
    else
      echo "NPM_TOKEN is not set"
    fi
```

## 🏆 Best Practices

### Security
- **Never commit secrets**: Use GitHub secrets for sensitive data
- **Limit token permissions**: Use minimal required permissions
- **Regular rotation**: Rotate tokens periodically
- **Audit access**: Regularly review who has access to secrets

### Performance
- **Use caching**: Enable npm cache in workflows
- **Parallel jobs**: Run independent jobs in parallel
- **Optimize dependencies**: Only install required dependencies
- **Clean up artifacts**: Remove unnecessary build artifacts

### Reliability
- **Test workflows**: Test workflows in development branches
- **Rollback plan**: Have a plan for failed deployments
- **Monitoring**: Set up alerts for workflow failures
- **Documentation**: Keep workflow documentation up to date

### Maintenance
- **Regular updates**: Keep GitHub Actions up to date
- **Review logs**: Regularly review workflow logs
- **Optimize workflows**: Continuously improve workflow efficiency
- **Backup configuration**: Keep workflow configurations in version control

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [NPM Token Management](https://docs.npmjs.com/about-access-tokens)
- [Codecov Integration](https://docs.codecov.com/docs)
- [Slack Webhooks](https://api.slack.com/messaging/webhooks)
- [Discord Webhooks](https://discord.com/developers/docs/resources/webhook)

## 🆘 Support

If you encounter issues with GitHub Actions setup:

1. **Check the logs**: Review workflow execution logs
2. **Verify secrets**: Ensure all required secrets are set
3. **Test locally**: Run commands locally to verify they work
4. **Check permissions**: Verify repository and token permissions
5. **Create an issue**: Open a GitHub issue with detailed information

For additional help, refer to:
- [GitHub Actions Troubleshooting](https://docs.github.com/en/actions/troubleshooting)
- [Sheikh-CLI Issues](https://github.com/codienters/sheikh-cli/issues)
- [Community Discussions](https://github.com/codienters/sheikh-cli/discussions)
