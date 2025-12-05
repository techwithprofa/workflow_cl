const fs = require('fs-extra');
const path = require('path');
const yaml = require('yaml');
const moment = require('moment');

class ContextLoader {
  constructor(config) {
    this.config = config;
    this.docsPath = config.paths.docs;
    this.projectPath = config.paths.project;
  }

  /**
   * Load all system context for agent consumption
   */
  async loadFullContext() {
    const context = {
      timestamp: new Date().toISOString(),
      project: {},
      agents: {},
      todos: {},
      issues: {},
      user: {},
      checkpoints: {},
      recent: {}
    };

    try {
      // Load project context
      context.project = await this.loadProjectContext();

      // Load agent contexts
      context.agents = await this.loadAgentContexts();

      // Load TODOs
      context.todos = await this.loadTodos();

      // Load issues
      context.issues = await this.loadIssues();

      // Load user preferences and patterns
      context.user = await this.loadUserContext();

      // Load recent checkpoints
      context.checkpoints = await this.loadRecentCheckpoints();

      // Load recent activities
      context.recent = await this.loadRecentActivities();

      return context;
    } catch (error) {
      console.error('Error loading full context:', error.message);
      throw error;
    }
  }

  /**
   * Load project-specific context
   */
  async loadProjectContext() {
    const projectFiles = [
      'project/architecture.md',
      'project/status.json',
      'project/history.json'
    ];

    const context = {
      architecture: null,
      status: null,
      history: [],
      configuration: {}
    };

    for (const file of projectFiles) {
      const filePath = path.join(this.docsPath, file);
      try {
        if (file.endsWith('.json')) {
          if (fs.existsSync(filePath)) {
            context[file.replace('project/', '').replace('.json', '')] = fs.readJsonSync(filePath);
          }
        } else if (file.endsWith('.md')) {
          if (fs.existsSync(filePath)) {
            context[file.replace('project/', '').replace('.md', '')] = fs.readFileSync(filePath, 'utf8');
          }
        }
      } catch (error) {
        console.warn(`Warning: Could not load ${file}:`, error.message);
      }
    }

    return context;
  }

  /**
   * Load agent-specific contexts and metrics
   */
  async loadAgentContexts() {
    const agentsDir = path.join(this.docsPath, 'agents');
    const context = {};

    try {
      if (fs.existsSync(agentsDir)) {
        const agentDirs = fs.readdirSync(agentsDir)
          .filter(dir => fs.statSync(path.join(agentsDir, dir)).isDirectory());

        for (const agentDir of agentDirs) {
          const agentContext = path.join(agentsDir, agentDir);
          context[agentDir] = {};

          // Load metrics
          const metricsFile = path.join(agentContext, 'metrics.json');
          if (fs.existsSync(metricsFile)) {
            context[agentDir].metrics = fs.readJsonSync(metricsFile);
          }

          // Load tasks
          const tasksFile = path.join(agentContext, 'tasks.json');
          if (fs.existsSync(tasksFile)) {
            context[agentDir].tasks = fs.readJsonSync(tasksFile);
          }

          // Load context
          const contextFile = path.join(agentContext, 'context.md');
          if (fs.existsSync(contextFile)) {
            context[agentDir].context = fs.readFileSync(contextFile, 'utf8');
          }
        }
      }
    } catch (error) {
      console.warn('Warning: Could not load agent contexts:', error.message);
    }

    return context;
  }

  /**
   * Load TODO system data
   */
  async loadTodos() {
    const todoFile = path.join(this.docsPath, 'todo', 'project.json');

    try {
      if (fs.existsSync(todoFile)) {
        return fs.readJsonSync(todoFile);
      }
    } catch (error) {
      console.warn('Warning: Could not load TODOs:', error.message);
      return { todos: [] };
    }
  }

  /**
   * Load issue tracking data
   */
  async loadIssues() {
    const issues = {
      active: [],
      resolved: []
    };

    const issuesDir = path.join(this.docsPath, 'issues');

    try {
      if (fs.existsSync(issuesDir)) {
        const activeFile = path.join(issuesDir, 'active.json');
        if (fs.existsSync(activeFile)) {
          issues.active = fs.readJsonSync(activeFile);
        }

        const resolvedFile = path.join(issuesDir, 'resolved.json');
        if (fs.existsSync(resolvedFile)) {
          issues.resolved = fs.readJsonSync(resolvedFile);
        }
      }
    } catch (error) {
      console.warn('Warning: Could not load issues:', error.message);
    }

    return issues;
  }

  /**
   * Load user preferences and behavioral patterns
   */
  async loadUserContext() {
    const userDir = path.join(this.docsPath, 'user');
    const context = {
      preferences: {},
      patterns: {},
      profiles: {}
    };

    try {
      if (fs.existsSync(userDir)) {
        const preferencesFile = path.join(userDir, 'preferences.json');
        if (fs.existsSync(preferencesFile)) {
          context.preferences = fs.readJsonSync(preferencesFile);
        }

        const patternsFile = path.join(userDir, 'patterns.json');
        if (fs.existsSync(patternsFile)) {
          context.patterns = fs.readJsonSync(patternsFile);
        }

        // Load profiles (ML features)
        const profilesDir = path.join(userDir, 'profiles');
        if (fs.existsSync(profilesDir)) {
          const profileFiles = fs.readdirSync(profilesDir)
            .filter(file => file.endsWith('.json'));

          for (const profileFile of profileFiles) {
            const profileName = profileFile.replace('.json', '');
            context.profiles[profileName] = fs.readJsonSync(path.join(profilesDir, profileFile));
          }
        }
      }
    } catch (error) {
      console.warn('Warning: Could not load user context:', error.message);
    }

    return context;
  }

  /**
   * Load recent system checkpoints
   */
  async loadRecentCheckpoints() {
    const checkpointsDir = path.join(this.docsPath, 'checkpoints');
    const checkpoints = [];

    try {
      if (fs.existsSync(checkpointsDir)) {
        const files = fs.readdirSync(checkpointsDir)
          .filter(file => file.endsWith('.json'))
          .sort((a, b) => {
            const statA = fs.statSync(path.join(checkpointsDir, a));
            const statB = fs.statSync(path.join(checkpointsDir, b));
            return statB.mtime.getTime() - statA.mtime.getTime();
          })
          .reverse()
          .slice(0, 10); // Last 10 checkpoints

        for (const file of files) {
          const filePath = path.join(checkpointsDir, file);
          try {
            const checkpoint = fs.readJsonSync(filePath);
            checkpoints.push({
              name: file.replace('.json', ''),
              timestamp: checkpoint.timestamp,
              type: checkpoint.type,
              description: checkpoint.description,
              data: checkpoint
            });
          } catch (error) {
            console.warn(`Warning: Could not load checkpoint ${file}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.warn('Warning: Could not load checkpoints:', error.message);
    }

    return checkpoints;
  }

  /**
   * Load recent system activities and patterns
   */
  async loadRecentActivities() {
    const recent = {
      hooks: [],
      logs: [],
      errors: [],
      patterns: {}
    };

    try {
      // Load recent hook executions
      const logsDir = path.join(this.docsPath, 'logs');
      if (fs.existsSync(logsDir)) {
        const logFiles = fs.readdirSync(logsDir)
          .filter(file => file.endsWith('.log'))
          .sort((a, b) => {
            const statA = fs.statSync(path.join(logsDir, a));
            const statB = fs.statSync(path.join(logsDir, b));
            return statB.mtime.getTime() - statA.mtime.getTime();
          })
          .reverse()
          .slice(0, 5); // Last 5 log files

        for (const logFile of logFiles) {
          const filePath = path.join(logsDir, logFile);
          try {
            const stats = fs.statSync(filePath);
            const content = fs.readFileSync(filePath, 'utf8')
              .split('\n')
              .filter(line => line.trim().length > 0)
              .slice(-20); // Last 20 lines

            recent.hooks.push({
              file: logFile,
              timestamp: stats.mtime.toISOString(),
              lines: content.length,
              entries: content.slice(-10), // Last 10 entries
              size: stats.size
            });
          } catch (error) {
            console.warn(`Warning: Could not read log file ${logFile}:`, error.message);
          }
        }
      }

      // Load recent error patterns
      const errorFile = path.join(logsDir, 'errors.log');
      if (fs.existsSync(errorFile)) {
        const errorContent = fs.readFileSync(errorFile, 'utf8')
          .split('\n')
          .filter(line => line.trim().length > 0)
          .slice(-10);

        recent.errors = errorContent.map(line => {
          return {
            timestamp: line.split(' ')[0],
            error: line.split(' ').slice(1).join(' ')
          };
        });
      }
    } catch (error) {
      console.warn('Warning: Could not load recent activities:', error.message);
    }

    return recent;
  }

  /**
   * Save context checkpoint for recovery
   */
  async saveCheckpoint(type, description, data) {
    const checkpointsDir = path.join(this.docsPath, 'checkpoints');
    fs.ensureDirSync(checkpointsDir);

    const checkpoint = {
      type,
      description,
      timestamp: new Date().toISOString(),
      data,
      system_info: {
        node_version: process.version,
        platform: process.platform,
        memory_usage: process.memoryUsage(),
        uptime: process.uptime()
      }
    };

    const fileName = `${type}-${moment().format('YYYY-MM-DD-HH-mm-ss')}.json`;
    const filePath = path.join(checkpointsDir, fileName);

    fs.writeJsonSync(filePath, checkpoint);
    return checkpoint;
  }

  /**
   * Extract specific context for agent use
   */
  extractContextForAgent(agentName, specificContext = {}) {
    const context = {
      general: {},
      project: {},
      relevant: {},
      recent: {}
    };

    try {
      // General context (always included)
      context.general = {
        timestamp: new Date().toISOString(),
        current_user: 'system', // This would be dynamic in real implementation
        session_id: this.generateSessionId()
      };

      // Project context
      if (fs.existsSync(path.join(this.docsPath, 'project/status.json'))) {
        context.project = fs.readJsonSync(path.join(this.docsPath, 'project/status.json'));
      }

      // Agent-specific context
      const agentDir = path.join(this.docsPath, 'agents', agentName);
      if (fs.existsSync(agentDir)) {
        // Load agent metrics
        const metricsFile = path.join(agentDir, 'metrics.json');
        if (fs.existsSync(metricsFile)) {
          context.relevant.agent_metrics = fs.readJsonSync(metricsFile);
        }

        // Load recent tasks for this agent
        const tasksFile = path.join(agentDir, 'tasks.json');
        if (fs.existsSync(tasksFile)) {
          context.recent.agent_tasks = fs.readJsonSync(tasksFile)
            .filter(task => task.assigned_to === agentName)
            .slice(-10); // Last 10 tasks
        }

        // Load specific context if provided
        if (specificContext && Object.keys(specificContext).length > 0) {
          context.relevant.specific = specificContext;
        }
      }

      return context;
    } catch (error) {
      console.warn(`Warning: Could not extract context for ${agentName}:`, error.message);
      return context;
    }
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get system health status
   */
  async getSystemHealth() {
    const health = {
      status: 'healthy',
      components: {},
      metrics: {},
      last_updated: new Date().toISOString()
    };

    try {
      // Check core directories
      const dirsToCheck = ['docs', 'hooks', 'skills'];
      for (const dir of dirsToCheck) {
        const dirPath = path.join(this.config.paths.claude, dir);
        health.components[dir] = {
          exists: fs.existsSync(dirPath),
          accessible: fs.existsSync(dirPath) && fs.accessSync(dirPath, fs.constants.R_OK | fs.constants.W_OK),
          file_count: 0,
          last_modified: null
        };

        if (health.components[dir].exists) {
          health.components[dir].file_count = fs.readdirSync(dirPath).length;
          health.components[dir].last_modified = fs.statSync(dirPath).mtime.toISOString();
        }
      }

      // Load system metrics
      const metricsFile = path.join(this.docsPath, 'system/metrics.json');
      if (fs.existsSync(metricsFile)) {
        health.metrics = fs.readJsonSync(metricsFile);
      }

    } catch (error) {
      health.status = 'error';
      health.error = error.message;
    }

    return health;
  }
}

module.exports = ContextLoader;