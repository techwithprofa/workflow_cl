const { spawn } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

class AgentCaller {
  constructor(config) {
    this.config = config;
    this.claudePath = config.claude.cliPath;
    this.maxRetries = config.claude.maxRetries || 3;
    this.timeout = config.claude.timeout || 30000;
  }

  /**
   * Execute Claude agent with specified context and task
   */
  async callAgent(agentName, task, context = {}) {
    const spinner = ora(`Calling ${agentName}...`).start();

    try {
      const agentConfig = this.config.agents[agentName];
      if (!agentConfig) {
        throw new Error(`Agent ${agentName} not found in configuration`);
      }

      // Build CLI command
      const args = [
        '--agent', agentName,
        '--timeout', this.timeout.toString(),
        '--max-retries', this.maxRetries.toString()
      ];

      // Prepare environment
      const env = {
        ...process.env,
        HOOK_DATA: JSON.stringify({
          task,
          agent: agentName,
          context,
          timestamp: new Date().toISOString(),
          project_path: this.config.paths.project
        })
      };

      spinner.succeed(`Executing ${agentName} with task: ${task.substring(0, 50)}${task.length > 50 ? '...' : ''}`);

      // Execute Claude CLI
      const result = await this.executeCommand(this.claudePath, args, env);

      return {
        success: true,
        agent: agentName,
        task,
        result: result.output,
        duration: result.duration,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      spinner.fail(`Failed to call ${agentName}: ${error.message}`);
      return {
        success: false,
        agent: agentName,
        task,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Execute shell command with timeout and retries
   */
  async executeCommand(command, args = [], env = {}) {
    const startTime = Date.now();
    let retries = 0;

    while (retries < this.maxRetries) {
      try {
        const result = await this.executeWithTimeout(command, args, env);
        if (result.exitCode === 0) {
          return {
            ...result,
            duration: Date.now() - startTime,
            retries
          };
        }

        if (retries < this.maxRetries - 1) {
          console.log(chalk.yellow(`Retry ${retries + 1}/${this.maxRetries} for ${command} ${args.join(' ')}`));
          await this.sleep(2000 * (retries + 1)); // Exponential backoff
        }
        retries++;
      } catch (error) {
        if (retries < this.maxRetries - 1) {
          console.log(chalk.yellow(`Retry ${retries + 1}/${this.maxRetries} for ${command} ${args.join(' ')}`));
          await this.sleep(2000 * (retries + 1)); // Exponential backoff
        }
        retries++;

        if (retries >= this.maxRetries) {
          throw new Error(`Command failed after ${this.maxRetries} retries: ${error.message}`);
        }
      }
    }
  }

  /**
   * Execute command with timeout
   */
  async executeWithTimeout(command, args, env) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        env,
        stdio: ['pipe', 'pipe', 'inherit'],
        shell: true
      });

      let stdout = '';
      let stderr = '';
      let timeoutId;

      // Set up timeout
      if (this.timeout > 0) {
        timeoutId = setTimeout(() => {
          child.kill('SIGTERM');
          reject(new Error(`Command timed out after ${this.timeout}ms`));
        }, this.timeout);
      }

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        resolve({
          exitCode: code,
          output: stdout,
          error: stderr
        });
      });

      child.on('error', (error) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        reject(error);
      });
    });
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get available agents
   */
  getAvailableAgents() {
    return Object.keys(this.config.agents);
  }

  /**
   * Get agent configuration
   */
  getAgentConfig(agentName) {
    return this.config.agents[agentName];
  }

  /**
   * Execute hook
   */
  async executeHook(hookName, data = {}) {
    const hookPath = path.join(this.config.paths.hooks, `${hookName}.sh`);

    if (!fs.existsSync(hookPath)) {
      throw new Error(`Hook ${hookName} not found at ${hookPath}`);
    }

    const env = {
      ...process.env,
      HOOK_DATA: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        project_path: this.config.paths.project
      })
    };

    return this.executeCommand('bash', [hookPath], env);
  }

  /**
   * Execute multiple agents in parallel
   */
  async callAgentsParallel(calls) {
    const promises = calls.map(call =>
      this.callAgent(call.agent, call.task, call.context)
    );

    const results = await Promise.allSettled(promises);

    return results.map((result, index) => ({
      call: calls[index],
      result: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null
    }));
  }
}

module.exports = AgentCaller;