const { spawn } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

class HookRunner {
  constructor(config) {
    this.config = config;
    this.hooksPath = config.paths.hooks;
    this.logPath = path.join(config.paths.docs, 'logs');
  }

  /**
   * Execute a hook with HOOK_DATA
   */
  async executeHook(hookName, hookData = {}) {
    const spinner = ora(`Running ${hookName}...`).start();

    try {
      // Prepare HOOK_DATA environment
      const env = {
        ...process.env,
        HOOK_DATA: JSON.stringify({
          hook_name: hookName,
          ...hookData
        })
      };

      // Build command
      const command = `bash "${path.join(this.hooksPath, hookName)}"`;

      spinner.text = `Executing: ${command}`;

      // Execute hook with timeout
      const { spawn } = require('child_process');
      const child = spawn('bash', ['-c', command], {
        env: {
          ...env,
          HOOK_DATA: env.HOOK_DATA
        },
        stdio: ['pipe', 'pipe', 'inherit'],
        shell: true
      });

      let stdout = '';
      let stderr = '';

      // Set timeout
      const timeout = 30000; // 30 seconds

      return new Promise((resolve, reject) => {
        let timeoutId;

        if (timeout > 0) {
          timeoutId = setTimeout(() => {
            child.kill('SIGTERM');
            reject(new Error(`Hook ${hookName} timed out after ${timeout}ms`));
          }, timeout);
        }

        // Capture output
        child.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        child.on('close', (code) => {
          clearTimeout(timeoutId);
          spinner.succeed();

          if (code === 0) {
            // Success
            this.logHookExecution(hookName, 'success', stdout, stderr);
            resolve({
              success: true,
              hook: hookName,
              stdout: stdout.trim(),
              stderr: stderr.trim(),
              exitCode: code,
              timestamp: new Date().toISOString()
            });
          } else {
            // Error
            this.logHookExecution(hookName, 'error', stdout, stderr, code);
            reject(new Error(`Hook ${hookName} failed with exit code ${code}: ${stderr || stdout}`));
          }
        });
      });
    } catch (error) {
      spinner.fail(`Hook ${hookName} failed: ${error.message}`);
      this.logHookExecution(hookName, 'error', '', error.message);
      reject(error);
    }
  }

  /**
   * Execute hook with detailed logging
   */
  async executeHookWithRetry(hookName, hookData = {}, retries = 3) {
    let attempt = 0;

    while (attempt < retries) {
      try {
        const result = await this.executeHook(hookName, hookData);

        if (result.success || result.exitCode === 0) {
          return result;
        } else {
          console.warn(`Hook ${hookName} attempt ${attempt + 1}/${retries} failed, retrying...`);
          await this.sleep(1000 * attempt); // Wait 1 second before retry
        }
      } catch (error) {
        if (attempt === retries - 1) {
          console.error(`Hook ${hookName} failed after ${retries} attempts:`, error.message);
          this.logHookExecution(hookName, 'error', '', error.message, 'retry_failed');
          throw error;
        }
        attempt++;
      }
    }

    throw new Error(`Hook ${hookName} failed after ${retries} retries: ${error.message}`);
  }

  /**
   * Log hook execution
   */
  logHookExecution(hookName, status, stdout, stderr, errorCode = null, error = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      hook_name: hookName,
      status: status,
      stdout: stdout.substring(0, 1000),
      stderr: stderr.substring(0, 1000),
      exit_code: errorCode,
      error: error,
      duration: 0
    };

    // Log to file system
    this.logHookToFile(logEntry);

    // Log to console with color coding
    if (status === 'success') {
      console.log(chalk.green(`✓ ${hookName}`));
    } else if (status === 'error') {
      console.log(chalk.red(`✗ ${hookName}`));
    } else {
      console.log(chalk.yellow(`⚠ ${hookName}`));
    }

    // Send notification if configured
    if (this.config.notifications.enabled) {
      this.sendNotification('hook_execution', logEntry);
    }
  }

  /**
   * Log hook execution to file
   */
  logHookToFile(logEntry) {
    try {
      const logDir = path.dirname(this.logPath);
      fs.ensureDirSync(logDir);

      const logFile = path.join(logDir, `hook-executions-${new Date().toISOString().split('T')[0]}.json`);

      // Read existing logs or create new array
      let logs = [];
      if (fs.existsSync(logFile)) {
        try {
          logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
        } catch (e) {
          // If file is corrupted, start fresh
          console.warn(`Warning: Could not parse existing log file ${logFile}, starting fresh: ${e.message}`);
        }
      }

      logs.push(logEntry);

      // Keep only last 1000 log entries
      if (logs.length > 1000) {
        logs = logs.slice(-1000);
      }

      fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    } catch (error) {
      console.error(`Error writing to log file ${logFile}:`, error.message);
    }
  }

  /**
   * Send notification
   */
  sendNotification(type, data) {
    if (this.config.notifications.channels.includes('console')) {
      this.logNotification(type, data);
    }

    if (this.config.notifications.channels.includes('file')) {
      this.saveNotificationToFile(type, data);
    }

    if (this.config.notifications.channels.includes('desktop')) {
      // Could integrate with system notification here
      console.log('Desktop notification would be sent for:', type);
    }
  }

  /**
   * Log notification to console
   */
  logNotification(type, data) {
    const level = this.config.notifications.levels.includes(type) ? type : 'info';

    switch (level) {
      case 'success':
        console.log(chalk.green(`✓ SUCCESS: ${data.message || type}`));
        break;
      case 'warn':
        console.log(chalk.yellow(`⚠ WARNING: ${data.message || type}`));
        break;
      case 'error':
        console.error(chalk.red(`✗ ERROR: ${data.message || type}`));
        break;
      default:
        console.log(`ℹ INFO: ${data.message || type}`);
    }
  }

  /**
   * Save notification to file
   */
  saveNotificationToFile(type, data) {
    const notificationsFile = path.join(this.config.paths.docs, 'notifications', 'system.json');

    try {
      const notifications = fs.existsSync(notificationsFile)
        ? JSON.parse(fs.readFileSync(notificationsFile, 'utf8'))
        : [];

      const notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: type,
        timestamp: new Date().toISOString(),
        message: data.message || type,
        data: data
      };

      notifications.push(notification);

      // Keep only last 100 notifications
      if (notifications.length > 100) {
        notifications = notifications.slice(-100);
      }

      fs.writeFileSync(notificationsFile, JSON.stringify(notifications, null, 2));
    } catch (error) {
      console.error(`Error saving notification:`, error.message);
    }
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = HookRunner;