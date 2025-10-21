#!/usr/bin/env node

/**
 * Sheikh-CLI Analysis Script
 * Performs comprehensive codebase analysis for GitHub Actions workflows
 */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

class CodebaseAnalyzer {
  constructor() {
    this.analysis = {
      timestamp: new Date().toISOString(),
      summary: {},
      files: [],
      dependencies: {},
      metrics: {}
    };
  }

  async analyze() {
    console.log('🔍 Starting Sheikh-CLI codebase analysis...');
    
    try {
      await this.analyzeFiles();
      await this.analyzeDependencies();
      await this.calculateMetrics();
      await this.generateReport();
      
      console.log('✅ Analysis completed successfully!');
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
      process.exit(1);
    }
  }

  async analyzeFiles() {
    console.log('📁 Analyzing source files...');
    
    const patterns = [
      'src/**/*.js',
      'src/**/*.json',
      'src/**/*.md',
      '*.js',
      '*.json',
      '*.md'
    ];

    for (const pattern of patterns) {
      const files = glob.sync(pattern, { ignore: ['node_modules/**', 'dist/**', 'coverage/**'] });
      
      for (const file of files) {
        const stats = fs.statSync(file);
        const content = fs.readFileSync(file, 'utf8');
        
        this.analysis.files.push({
          path: file,
          size: stats.size,
          lines: content.split('\n').length,
          type: path.extname(file),
          lastModified: stats.mtime
        });
      }
    }

    this.analysis.summary.totalFiles = this.analysis.files.length;
    this.analysis.summary.totalSize = this.analysis.files.reduce((sum, file) => sum + file.size, 0);
    this.analysis.summary.totalLines = this.analysis.files.reduce((sum, file) => sum + file.lines, 0);
  }

  async analyzeDependencies() {
    console.log('📦 Analyzing dependencies...');
    
    try {
      const packageJson = fs.readJsonSync('package.json');
      
      this.analysis.dependencies = {
        production: Object.keys(packageJson.dependencies || {}),
        development: Object.keys(packageJson.devDependencies || {}),
        total: Object.keys(packageJson.dependencies || {}).length + 
               Object.keys(packageJson.devDependencies || {}).length
      };
      
      this.analysis.summary.totalDependencies = this.analysis.dependencies.total;
    } catch (error) {
      console.warn('⚠️ Could not analyze dependencies:', error.message);
    }
  }

  async calculateMetrics() {
    console.log('📊 Calculating metrics...');
    
    const jsFiles = this.analysis.files.filter(file => file.type === '.js');
    const testFiles = this.analysis.files.filter(file => file.path.includes('test') || file.path.includes('spec'));
    
    this.analysis.metrics = {
      codeFiles: jsFiles.length,
      testFiles: testFiles.length,
      testCoverage: testFiles.length > 0 ? (testFiles.length / jsFiles.length * 100).toFixed(2) : 0,
      averageFileSize: this.analysis.files.length > 0 ? 
        (this.analysis.summary.totalSize / this.analysis.files.length).toFixed(2) : 0,
      averageLinesPerFile: this.analysis.files.length > 0 ? 
        (this.analysis.summary.totalLines / this.analysis.files.length).toFixed(2) : 0
    };
  }

  async generateReport() {
    console.log('📝 Generating analysis report...');
    
    const report = `# Sheikh-CLI Codebase Analysis Report

Generated on: ${this.analysis.timestamp}

## 📊 Summary

- **Total Files**: ${this.analysis.summary.totalFiles}
- **Total Size**: ${(this.analysis.summary.totalSize / 1024).toFixed(2)} KB
- **Total Lines**: ${this.analysis.summary.totalLines}
- **Total Dependencies**: ${this.analysis.summary.totalDependencies}

## 📈 Metrics

- **Code Files**: ${this.analysis.metrics.codeFiles}
- **Test Files**: ${this.analysis.metrics.testFiles}
- **Test Coverage Ratio**: ${this.analysis.metrics.testCoverage}%
- **Average File Size**: ${this.analysis.metrics.averageFileSize} bytes
- **Average Lines per File**: ${this.analysis.metrics.averageLinesPerFile}

## 📦 Dependencies

### Production Dependencies (${this.analysis.dependencies.production.length})
${this.analysis.dependencies.production.map(dep => `- ${dep}`).join('\n')}

### Development Dependencies (${this.analysis.dependencies.development.length})
${this.analysis.dependencies.development.map(dep => `- ${dep}`).join('\n')}

## 📁 File Analysis

### Largest Files
${this.analysis.files
  .sort((a, b) => b.size - a.size)
  .slice(0, 10)
  .map(file => `- ${file.path}: ${(file.size / 1024).toFixed(2)} KB (${file.lines} lines)`)
  .join('\n')}

### Most Complex Files (by line count)
${this.analysis.files
  .sort((a, b) => b.lines - a.lines)
  .slice(0, 10)
  .map(file => `- ${file.path}: ${file.lines} lines`)
  .join('\n')}

## 🔍 Analysis Details

This analysis was performed by the Sheikh-CLI automated analysis system as part of the GitHub Actions CI/CD pipeline.

### Analysis Components
- ✅ File discovery and categorization
- ✅ Dependency analysis
- ✅ Code metrics calculation
- ✅ Report generation

### Recommendations
- Monitor file sizes for maintainability
- Ensure adequate test coverage
- Regular dependency updates
- Code complexity monitoring

---
*Generated by Sheikh-CLI Analysis Script v1.0.0*
`;

    // Write to file if output path specified
    const outputPath = process.argv.find(arg => arg.startsWith('--output='));
    if (outputPath) {
      const filePath = outputPath.split('=')[1];
      fs.writeFileSync(filePath, report);
      console.log(`📄 Report written to: ${filePath}`);
    } else {
      console.log(report);
    }
  }
}

// Run analysis if called directly
if (require.main === module) {
  const analyzer = new CodebaseAnalyzer();
  analyzer.analyze();
}

module.exports = CodebaseAnalyzer;
