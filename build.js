#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

class BuildSystem {
  constructor() {
    this.rootDir = process.cwd();
    this.srcDir = path.join(this.rootDir, 'src');
    this.distDir = path.join(this.rootDir, 'dist');
    this.buildDir = path.join(this.rootDir, 'build');
  }

  async build() {
    console.log(chalk.blue.bold('🏗️ Building Sheikh-CLI Agentic Engine...'));
    
    try {
      await this.clean();
      await this.compileTypeScript();
      await this.copyAssets();
      await this.generatePackageJson();
      await this.generateBinaries();
      await this.runPostBuild();
      
      console.log(chalk.green.bold('✅ Build completed successfully!'));
      console.log(chalk.gray(`📦 Output: ${this.distDir}`));
      
    } catch (error) {
      console.error(chalk.red.bold('❌ Build failed:'), error.message);
      process.exit(1);
    }
  }

  async clean() {
    console.log(chalk.yellow('🧹 Cleaning build directories...'));
    
    await fs.remove(this.distDir);
    await fs.remove(this.buildDir);
    await fs.ensureDir(this.distDir);
    await fs.ensureDir(this.buildDir);
  }

  async compileTypeScript() {
    console.log(chalk.yellow('📝 Compiling TypeScript...'));
    
    try {
      execSync('npx tsc', { stdio: 'inherit' });
      console.log(chalk.green('✅ TypeScript compilation completed'));
    } catch (error) {
      throw new Error('TypeScript compilation failed');
    }
  }

  async copyAssets() {
    console.log(chalk.yellow('📋 Copying assets...'));
    
    const assetsToCopy = [
      'README.md',
      'LICENSE',
      'CHANGELOG.md',
      'CLAUDE.md',
      'AGENTS.md',
      'THIRD_PARTY_NOTICES'
    ];

    for (const asset of assetsToCopy) {
      const srcPath = path.join(this.rootDir, asset);
      const destPath = path.join(this.distDir, asset);
      
      if (await fs.pathExists(srcPath)) {
        await fs.copy(srcPath, destPath);
        console.log(chalk.gray(`  📄 Copied ${asset}`));
      }
    }

    // Copy .claude directory if it exists
    const claudeDir = path.join(this.rootDir, '.claude');
    if (await fs.pathExists(claudeDir)) {
      const destClaudeDir = path.join(this.distDir, '.claude');
      await fs.copy(claudeDir, destClaudeDir);
      console.log(chalk.gray('  📁 Copied .claude directory'));
    }
  }

  async generatePackageJson() {
    console.log(chalk.yellow('📦 Generating package.json for distribution...'));
    
    const originalPackageJson = await fs.readJson(path.join(this.rootDir, 'package.json'));
    
    const distPackageJson = {
      name: originalPackageJson.name,
      version: originalPackageJson.version,
      description: originalPackageJson.description,
      main: 'cli-enhanced.js',
      bin: {
        sheikh: 'cli-enhanced.js'
      },
      keywords: originalPackageJson.keywords,
      author: originalPackageJson.author,
      license: originalPackageJson.license,
      repository: originalPackageJson.repository,
      bugs: originalPackageJson.bugs,
      homepage: originalPackageJson.homepage,
      engines: originalPackageJson.engines,
      files: [
        '*.js',
        '*.md',
        '*.json',
        '.claude/',
        'LICENSE',
        'THIRD_PARTY_NOTICES'
      ],
      dependencies: this.filterDependencies(originalPackageJson.dependencies),
      peerDependencies: originalPackageJson.peerDependencies,
      peerDependenciesMeta: originalPackageJson.peerDependenciesMeta,
      publishConfig: originalPackageJson.publishConfig,
      funding: originalPackageJson.funding
    };

    await fs.writeJson(
      path.join(this.distDir, 'package.json'),
      distPackageJson,
      { spaces: 2 }
    );

    console.log(chalk.green('✅ Distribution package.json generated'));
  }

  filterDependencies(dependencies) {
    // Only include production dependencies
    const devDependencies = [
      'jest', 'eslint', 'prettier', 'nodemon', 'typescript',
      'supertest', 'nock', 'sinon', 'chai', 'mocha', 'nyc',
      'cross-env', 'husky', 'lint-staged'
    ];

    const filtered = {};
    for (const [name, version] of Object.entries(dependencies || {})) {
      if (!devDependencies.includes(name)) {
        filtered[name] = version;
      }
    }

    return filtered;
  }

  async generateBinaries() {
    console.log(chalk.yellow('🔧 Generating binaries...'));
    
    const binContent = `#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Find the correct path to the main file
const mainFile = path.join(__dirname, 'cli-enhanced.js');

if (fs.existsSync(mainFile)) {
  require(mainFile);
} else {
  console.error('Error: Main file not found');
  process.exit(1);
}
`;

    await fs.writeFile(path.join(this.distDir, 'cli-enhanced.js'), binContent);
    await fs.chmod(path.join(this.distDir, 'cli-enhanced.js'), '755');
    
    console.log(chalk.green('✅ Binaries generated'));
  }

  async runPostBuild() {
    console.log(chalk.yellow('🔍 Running post-build tasks...'));
    
    // Validate build output
    await this.validateBuild();
    
    // Generate build info
    await this.generateBuildInfo();
    
    console.log(chalk.green('✅ Post-build tasks completed'));
  }

  async validateBuild() {
    const requiredFiles = [
      'cli-enhanced.js',
      'package.json',
      'README.md'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(this.distDir, file);
      if (!await fs.pathExists(filePath)) {
        throw new Error(`Required file missing: ${file}`);
      }
    }

    console.log(chalk.gray('  ✅ Build validation passed'));
  }

  async generateBuildInfo() {
    const buildInfo = {
      buildTime: new Date().toISOString(),
      version: require('./package.json').version,
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    };

    await fs.writeJson(
      path.join(this.distDir, 'build-info.json'),
      buildInfo,
      { spaces: 2 }
    );

    console.log(chalk.gray('  📊 Build info generated'));
  }
}

// Run build if called directly
if (require.main === module) {
  const buildSystem = new BuildSystem();
  buildSystem.build().catch(error => {
    console.error(chalk.red.bold('❌ Build failed:'), error.message);
    process.exit(1);
  });
}

module.exports = BuildSystem;
