#!/usr/bin/env node

/**
 * Sheikh-CLI Complexity Analysis Script
 * Analyzes code complexity metrics for GitHub Actions workflows
 */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

class ComplexityAnalyzer {
  constructor() {
    this.complexity = {
      timestamp: new Date().toISOString(),
      files: [],
      metrics: {
        totalComplexity: 0,
        averageComplexity: 0,
        maxComplexity: 0,
        highComplexityFiles: []
      }
    };
  }

  async analyze() {
    console.log('📊 Starting Sheikh-CLI complexity analysis...');
    
    try {
      await this.analyzeFiles();
      await this.calculateMetrics();
      await this.generateReport();
      
      console.log('✅ Complexity analysis completed successfully!');
    } catch (error) {
      console.error('❌ Complexity analysis failed:', error.message);
      process.exit(1);
    }
  }

  async analyzeFiles() {
    console.log('📁 Analyzing file complexity...');
    
    const jsFiles = glob.sync('src/**/*.js', { ignore: ['node_modules/**', 'dist/**', 'coverage/**'] });
    
    for (const file of jsFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const complexity = this.calculateFileComplexity(content);
      
      this.complexity.files.push({
        path: file,
        complexity: complexity,
        lines: content.split('\n').length,
        functions: this.countFunctions(content),
        classes: this.countClasses(content),
        imports: this.countImports(content)
      });
    }
  }

  calculateFileComplexity(content) {
    // Simple complexity calculation based on:
    // - Number of functions
    // - Number of conditional statements
    // - Number of loops
    // - Nesting depth
    
    const lines = content.split('\n');
    let complexity = 0;
    let maxNesting = 0;
    let currentNesting = 0;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Count functions
      if (trimmed.match(/function\s+\w+|const\s+\w+\s*=\s*\(|=>\s*{|class\s+\w+/)) {
        complexity += 1;
      }
      
      // Count conditionals
      if (trimmed.match(/if\s*\(|else\s*if\s*\(|switch\s*\(/)) {
        complexity += 1;
        currentNesting += 1;
        maxNesting = Math.max(maxNesting, currentNesting);
      }
      
      // Count loops
      if (trimmed.match(/for\s*\(|while\s*\(|do\s*{/)) {
        complexity += 1;
        currentNesting += 1;
        maxNesting = Math.max(maxNesting, currentNesting);
      }
      
      // Count try-catch blocks
      if (trimmed.match(/try\s*{|catch\s*\(/)) {
        complexity += 1;
      }
      
      // Decrease nesting on closing braces
      if (trimmed === '}' || trimmed === '});') {
        currentNesting = Math.max(0, currentNesting - 1);
      }
    }
    
    // Add nesting penalty
    complexity += maxNesting * 0.5;
    
    return Math.round(complexity * 10) / 10; // Round to 1 decimal place
  }

  countFunctions(content) {
    const functionMatches = content.match(/function\s+\w+|const\s+\w+\s*=\s*\(|=>\s*{|class\s+\w+/g);
    return functionMatches ? functionMatches.length : 0;
  }

  countClasses(content) {
    const classMatches = content.match(/class\s+\w+/g);
    return classMatches ? classMatches.length : 0;
  }

  countImports(content) {
    const importMatches = content.match(/import\s+.*from|require\s*\(/g);
    return importMatches ? importMatches.length : 0;
  }

  async calculateMetrics() {
    console.log('📈 Calculating complexity metrics...');
    
    if (this.complexity.files.length === 0) {
      return;
    }
    
    const complexities = this.complexity.files.map(file => file.complexity);
    
    this.complexity.metrics.totalComplexity = complexities.reduce((sum, c) => sum + c, 0);
    this.complexity.metrics.averageComplexity = this.complexity.metrics.totalComplexity / this.complexity.files.length;
    this.complexity.metrics.maxComplexity = Math.max(...complexities);
    
    // Files with high complexity (>10)
    this.complexity.metrics.highComplexityFiles = this.complexity.files
      .filter(file => file.complexity > 10)
      .sort((a, b) => b.complexity - a.complexity);
  }

  async generateReport() {
    console.log('📝 Generating complexity report...');
    
    const report = `# Sheikh-CLI Complexity Analysis Report

Generated on: ${this.complexity.timestamp}

## 📊 Complexity Summary

- **Total Files Analyzed**: ${this.complexity.files.length}
- **Total Complexity**: ${this.complexity.metrics.totalComplexity}
- **Average Complexity**: ${this.complexity.metrics.averageComplexity.toFixed(2)}
- **Maximum Complexity**: ${this.complexity.metrics.maxComplexity}
- **High Complexity Files**: ${this.complexity.metrics.highComplexityFiles.length}

## 🚨 High Complexity Files (>10)

${this.complexity.metrics.highComplexityFiles.length > 0 ? 
  this.complexity.metrics.highComplexityFiles.map(file => 
    `- **${file.path}**: ${file.complexity} (${file.lines} lines, ${file.functions} functions)`
  ).join('\n') : 
  'No high complexity files found ✅'}

## 📈 Complexity Distribution

### Most Complex Files
${this.complexity.files
  .sort((a, b) => b.complexity - a.complexity)
  .slice(0, 10)
  .map(file => `- ${file.path}: ${file.complexity} (${file.lines} lines)`)
  .join('\n')}

### Complexity by Category

#### Low Complexity (0-5)
${this.complexity.files.filter(f => f.complexity <= 5).length} files

#### Medium Complexity (6-10)
${this.complexity.files.filter(f => f.complexity > 5 && f.complexity <= 10).length} files

#### High Complexity (11-20)
${this.complexity.files.filter(f => f.complexity > 10 && f.complexity <= 20).length} files

#### Very High Complexity (>20)
${this.complexity.files.filter(f => f.complexity > 20).length} files

## 🔍 Detailed Analysis

### File Statistics
${this.complexity.files.map(file => 
  `- **${file.path}**\n  - Complexity: ${file.complexity}\n  - Lines: ${file.lines}\n  - Functions: ${file.functions}\n  - Classes: ${file.classes}\n  - Imports: ${file.imports}`
).join('\n\n')}

## 📋 Recommendations

### Code Quality Improvements
${this.complexity.metrics.highComplexityFiles.length > 0 ? 
  `- **Refactor high complexity files**: Consider breaking down files with complexity >10
- **Focus on**: ${this.complexity.metrics.highComplexityFiles.slice(0, 3).map(f => f.path).join(', ')}` : 
  '- **Maintain current complexity levels**: All files are within acceptable complexity ranges'}

### Best Practices
- Keep functions small and focused
- Reduce nesting depth
- Extract complex logic into separate functions
- Use early returns to reduce complexity
- Consider using design patterns for complex logic

### Monitoring
- Track complexity trends over time
- Set complexity thresholds in CI/CD
- Regular code reviews for high complexity files
- Automated refactoring suggestions

## 🎯 Complexity Targets

- **Target Average**: < 8.0
- **Target Maximum**: < 15.0
- **High Complexity Threshold**: > 10.0
- **Critical Complexity Threshold**: > 20.0

**Current Status**: ${this.complexity.metrics.averageComplexity < 8 ? '✅ Within target' : '⚠️ Above target'}

---
*Generated by Sheikh-CLI Complexity Analyzer v1.0.0*
`;

    // Write to file if output path specified
    const outputPath = process.argv.find(arg => arg.startsWith('--output='));
    if (outputPath) {
      const filePath = outputPath.split('=')[1];
      fs.writeFileSync(filePath, report);
      console.log(`📄 Complexity report written to: ${filePath}`);
    } else {
      console.log(report);
    }
  }
}

// Run analysis if called directly
if (require.main === module) {
  const analyzer = new ComplexityAnalyzer();
  analyzer.analyze();
}

module.exports = ComplexityAnalyzer;
