/**
 * Skills Management Module
 *
 * Handles loading, managing, and executing custom skills
 *
 * @module skills/index
 */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const yaml = require('yaml');

/**
 * SkillsManager class
 * Handles skill discovery, loading, and execution
 */
class SkillsManager {
  constructor() {
    this.skills = new Map();
    this.skillsPath = path.join(process.cwd(), '.claude', 'skills');
  }

  /**
   * Load all skills from the filesystem
   * @returns {Promise<void>}
   */
  async loadSkills() {
    try {
      // Ensure skills directory exists
      await fs.ensureDir(this.skillsPath);

      // Find all skill files
      const skillFiles = glob.sync(path.join(this.skillsPath, '**', 'SKILL.md'));
      
      for (const skillFile of skillFiles) {
        try {
          const skill = await this.loadSkill(skillFile);
          if (skill) {
            this.skills.set(skill.name, skill);
          }
        } catch (error) {
          console.warn(`Failed to load skill from ${skillFile}:`, error.message);
        }
      }
    } catch (error) {
      throw new Error(`Failed to load skills: ${error.message}`);
    }
  }

  /**
   * Load a single skill from file
   * @param {string} skillFile - Path to skill file
   * @returns {Promise<Object|null>} Skill object or null if failed
   */
  async loadSkill(skillFile) {
    try {
      const content = await fs.readFile(skillFile, 'utf8');
      
      // Parse YAML frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!frontmatterMatch) {
        throw new Error('Invalid skill format: missing YAML frontmatter');
      }

      const frontmatter = yaml.parse(frontmatterMatch[1]);
      const skillContent = frontmatterMatch[2];

      // Validate required fields
      if (!frontmatter.name || !frontmatter.description) {
        throw new Error('Skill must have name and description in frontmatter');
      }

      return {
        name: frontmatter.name,
        description: frontmatter.description,
        content: skillContent,
        filePath: skillFile,
        ...frontmatter
      };
    } catch (error) {
      throw new Error(`Failed to load skill from ${skillFile}: ${error.message}`);
    }
  }

  /**
   * Get a skill by name
   * @param {string} skillName - Name of the skill
   * @returns {Object|null} Skill object or null if not found
   */
  getSkill(skillName) {
    return this.skills.get(skillName) || null;
  }

  /**
   * Get all loaded skills
   * @returns {Map} Map of skill names to skill objects
   */
  getSkills() {
    return this.skills;
  }

  /**
   * List all skill names
   * @returns {Array<string>} Array of skill names
   */
  listSkills() {
    return Array.from(this.skills.keys());
  }

  /**
   * Execute a skill with context
   * @param {string} skillName - Name of the skill to execute
   * @param {Object} context - Execution context
   * @returns {Promise<Object>} Execution result
   */
  async executeSkill(skillName, context = {}) {
    const skill = this.getSkill(skillName);
    if (!skill) {
      throw new Error(`Skill '${skillName}' not found`);
    }

    try {
      // In a real implementation, this would execute the skill
      // For now, we'll return a mock result
      return {
        success: true,
        skill: skillName,
        output: `Executed skill: ${skill.description}`,
        context: context
      };
    } catch (error) {
      throw new Error(`Failed to execute skill '${skillName}': ${error.message}`);
    }
  }

  /**
   * Create a new skill
   * @param {Object} skillData - Skill data
   * @returns {Promise<void>}
   */
  async createSkill(skillData) {
    const { name, description, content } = skillData;
    
    if (!name || !description) {
      throw new Error('Skill name and description are required');
    }

    const skillDir = path.join(this.skillsPath, name);
    const skillFile = path.join(skillDir, 'SKILL.md');

    await fs.ensureDir(skillDir);

    const skillContent = `---
name: ${name}
description: ${description}
---

# ${name}

${description}

${content || ''}
`;

    await fs.writeFile(skillFile, skillContent, 'utf8');
    
    // Reload skills
    await this.loadSkills();
  }

  /**
   * Delete a skill
   * @param {string} skillName - Name of the skill to delete
   * @returns {Promise<void>}
   */
  async deleteSkill(skillName) {
    const skill = this.getSkill(skillName);
    if (!skill) {
      throw new Error(`Skill '${skillName}' not found`);
    }

    const skillDir = path.dirname(skill.filePath);
    await fs.remove(skillDir);
    
    // Remove from loaded skills
    this.skills.delete(skillName);
  }

  /**
   * Validate skill configuration
   * @param {Object} skill - Skill object to validate
   * @returns {Object} Validation result
   */
  validateSkill(skill) {
    if (!skill) {
      return { valid: false, error: 'Skill object is required' };
    }

    if (!skill.name || typeof skill.name !== 'string') {
      return { valid: false, error: 'Skill name is required and must be a string' };
    }

    if (!skill.description || typeof skill.description !== 'string') {
      return { valid: false, error: 'Skill description is required and must be a string' };
    }

    return { valid: true };
  }
}

// Export singleton instance
const skillsManager = new SkillsManager();

module.exports = skillsManager;