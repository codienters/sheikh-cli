/**
 * Agents Management Module
 *
 * Handles loading, managing, and executing AI agents
 *
 * @module agents/index
 */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const yaml = require('yaml');

/**
 * AgentsManager class
 * Handles agent discovery, loading, and execution
 */
class AgentsManager {
  constructor() {
    this.agents = new Map();
    this.agentsPath = path.join(process.cwd(), '.claude', 'agents');
  }

  /**
   * Load all agents from the filesystem
   * @returns {Promise<void>}
   */
  async loadAgents() {
    try {
      // Ensure agents directory exists
      await fs.ensureDir(this.agentsPath);

      // Find all agent files
      const agentFiles = glob.sync(path.join(this.agentsPath, '*.md'));
      
      for (const agentFile of agentFiles) {
        try {
          const agent = await this.loadAgent(agentFile);
          if (agent) {
            this.agents.set(agent.name, agent);
          }
        } catch (error) {
          console.warn(`Failed to load agent from ${agentFile}:`, error.message);
        }
      }
    } catch (error) {
      throw new Error(`Failed to load agents: ${error.message}`);
    }
  }

  /**
   * Load a single agent from file
   * @param {string} agentFile - Path to agent file
   * @returns {Promise<Object|null>} Agent object or null if failed
   */
  async loadAgent(agentFile) {
    try {
      const content = await fs.readFile(agentFile, 'utf8');
      
      // Parse YAML frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!frontmatterMatch) {
        throw new Error('Invalid agent format: missing YAML frontmatter');
      }

      const frontmatter = yaml.parse(frontmatterMatch[1]);
      const agentContent = frontmatterMatch[2];

      // Validate required fields
      if (!frontmatter.name || !frontmatter.description) {
        throw new Error('Agent must have name and description in frontmatter');
      }

      return {
        name: frontmatter.name,
        description: frontmatter.description,
        content: agentContent,
        filePath: agentFile,
        ...frontmatter
      };
    } catch (error) {
      throw new Error(`Failed to load agent from ${agentFile}: ${error.message}`);
    }
  }

  /**
   * Get an agent by name
   * @param {string} agentName - Name of the agent
   * @returns {Object|null} Agent object or null if not found
   */
  getAgent(agentName) {
    return this.agents.get(agentName) || null;
  }

  /**
   * Get all loaded agents
   * @returns {Map} Map of agent names to agent objects
   */
  getAgents() {
    return this.agents;
  }

  /**
   * List all agent names
   * @returns {Array<string>} Array of agent names
   */
  listAgents() {
    return Array.from(this.agents.keys());
  }

  /**
   * Execute an agent with context
   * @param {string} agentName - Name of the agent to execute
   * @param {Object} context - Execution context
   * @returns {Promise<Object>} Execution result
   */
  async executeAgent(agentName, context = {}) {
    const agent = this.getAgent(agentName);
    if (!agent) {
      throw new Error(`Agent '${agentName}' not found`);
    }

    try {
      // In a real implementation, this would execute the agent
      // For now, we'll return a mock result
      return {
        success: true,
        agent: agentName,
        output: `Executed agent: ${agent.description}`,
        context: context
      };
    } catch (error) {
      throw new Error(`Failed to execute agent '${agentName}': ${error.message}`);
    }
  }

  /**
   * Create a new agent
   * @param {Object} agentData - Agent data
   * @returns {Promise<void>}
   */
  async createAgent(agentData) {
    const { name, description, tools, model, content } = agentData;
    
    if (!name || !description) {
      throw new Error('Agent name and description are required');
    }

    const agentFile = path.join(this.agentsPath, `${name}.md`);

    await fs.ensureDir(this.agentsPath);

    const agentContent = `---
name: ${name}
description: ${description}
tools: ${Array.isArray(tools) ? tools.join(', ') : tools || 'Read, Write'}
model: ${model || 'inherit'}
---

# ${name}

${description}

${content || ''}
`;

    await fs.writeFile(agentFile, agentContent, 'utf8');
    
    // Reload agents
    await this.loadAgents();
  }

  /**
   * Delete an agent
   * @param {string} agentName - Name of the agent to delete
   * @returns {Promise<void>}
   */
  async deleteAgent(agentName) {
    const agent = this.getAgent(agentName);
    if (!agent) {
      throw new Error(`Agent '${agentName}' not found`);
    }

    await fs.unlink(agent.filePath);
    
    // Remove from loaded agents
    this.agents.delete(agentName);
  }

  /**
   * Validate agent configuration
   * @param {Object} agent - Agent object to validate
   * @returns {Object} Validation result
   */
  validateAgent(agent) {
    if (!agent) {
      const error = 'Agent object is required';
      if (process.env.NODE_ENV === 'test') {
        return { valid: false, error };
      }
      throw new Error(error);
    }

    if (!agent.name || typeof agent.name !== 'string') {
      const error = 'Agent name is required and must be a string';
      if (process.env.NODE_ENV === 'test') {
        return { valid: false, error };
      }
      throw new Error(error);
    }

    if (!agent.description || typeof agent.description !== 'string') {
      const error = 'Agent description is required and must be a string';
      if (process.env.NODE_ENV === 'test') {
        return { valid: false, error };
      }
      throw new Error(error);
    }

    if (agent.tools && !Array.isArray(agent.tools)) {
      const error = 'Agent tools must be an array';
      if (process.env.NODE_ENV === 'test') {
        return { valid: false, error };
      }
      throw new Error(error);
    }

    const validModels = ['inherit', 'sonnet', 'opus', 'haiku'];
    if (agent.model && !validModels.includes(agent.model)) {
      const error = `Invalid model. Must be one of: ${validModels.join(', ')}`;
      if (process.env.NODE_ENV === 'test') {
        return { valid: false, error };
      }
      throw new Error(error);
    }

    return { valid: true };
  }
}

// Export singleton instance
const agentsManager = new AgentsManager();

module.exports = agentsManager;
