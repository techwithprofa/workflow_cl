#!/usr/bin/env node

/**
 * Claude Orchestrator - Multi-agent coordination system
 * Coordinates Claude Code agents via CLI for complex software development workflows
 */

require('dotenv').config();

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');

class ClaudeOrchestrator {
  constructor() {
    this.config = this.loadConfig();
    this.agentCaller = require('./lib/agent-caller');
    this.contextLoader = require('./lib/context-loader');
    this.todoManager = require('./lib/todo-manager');
    this.workflowOrchestrator = require('./lib/workflow');
    this.hookRunner = require('./lib/hook-runner');
    this.isRunning = false;
    this.currentProject = process.cwd();
  }

  /**
   * Load configuration from config.json
   */
  loadConfig() {
    try {
      const configPath = './config.json';
      if (require('fs').existsSync(configPath)) {
        return require(configPath);
      }
      throw new Error('Configuration file not found. Please run setup first.');
    } catch (error) {
      console.error('Error loading configuration:', error.message);
      process.exit(1);
    }
  }

  /**
   * Display usage help
   */
  showHelp() {
    console.log(chalk.blue.bold('\nClaude Orchestrator - Multi-Agent Workflow System\n'));

    console.log(chalk.yellow('Usage:'));
    console.log('  node index.js <command> [options]\n');
    console.log('');

    console.log(chalk.cyan('Commands:'));
    console.log('  create-login-page     Create login page with authentication');
    console.log('  build-feature        Build new feature from specification');
    console.log('  fix-bug             Fix bug with automatic debugging');
    console.log('  deploy               Deploy application');
    console.log('  run-workflow        Execute predefined workflow');
    console.log('  status               Show system status and metrics');
    console.log('  test-hooks          Test hook system functionality');
    console.log('  plan               Create project plan from requirements');
    console.log('  execute-task        Execute single task with agent');
    console.log('  help                Show this help message');
    console.log('');

    console.log(chalk.green('Options:'));
    console.log('  --project <path>     Set project directory');
    console.log('  --workflow <name>    Predefined workflow to run');
    console.log('  --agent <name>        Call specific agent directly');
    console.log('  --hook <name>        Execute specific hook');
    console.log('  --todo <action>       TODO management (create, list, update, complete)');
    console.log('  --dry-run          Show what would happen without executing');
    console.log('  --verbose           Show detailed execution output');
    console.log('  --watch            Watch for changes and auto-execute');
    console.log('');
  }

  /**
   * Parse command line arguments
   */
  parseArguments(argv) {
    const args = argv.slice(2);
    const command = args[0];

    return {
      command,
      args: args.slice(1),
      options: this.parseOptions(args),
      action: this.getAction(args)
    };
  }

  /**
   * Parse command options
   */
  parseOptions(args) {
    const options = {
      project: null,
      workflow: null,
      agent: null,
      hook: null,
      todo: null,
      dryRun: false,
      verbose: false,
      watch: false
    };

    let i = 0;
    while (i < args.length) {
      const arg = args[i];
      const nextArg = args[i + 1];

      if (arg.startsWith('--')) {
        const key = arg.substring(2);
        const value = nextArg && !nextArg.startsWith('--') ? nextArg : true;

        switch (key) {
          case '--project':
            options.project = value;
            break;
          case '--workflow':
            options.workflow = value;
            break;
          case '--agent':
            options.agent = value;
            break;
          case '--hook':
            options.hook = value;
            break;
          case '--todo':
            options.todo = value;
            break;
          case '--dry-run':
            options.dryRun = true;
            break;
          case '--verbose':
            options.verbose = true;
            break;
          case '--watch':
            options.watch = true;
            break;
          case '--help':
            this.showHelp();
            process.exit(0);
          default:
            i++; // Skip unknown option
        }
      } else {
        i++; // Skip unknown argument
      }
    }

    return options;
  }

  /**
   * Get action from command
   */
  getAction(args) {
    const command = args.command;

    // Map commands to actions
    const commandActions = {
      'create-login-page': 'createLoginPage',
      'build-feature': 'buildFeature',
      'fix-bug': 'fixBug',
      'deploy': 'deploy',
      'run-workflow': 'runWorkflow',
      'status': 'showStatus',
      'test-hooks': 'testHooks',
      'plan': 'createPlan',
      'execute-task': 'executeTask',
      'help': 'showHelp',
      'todo': 'manageTodos'
    };

    return commandActions[command] || 'help';
  }

  /**
   * Create login page
   */
  async createLoginPage() {
    const spinner = ora('Creating login page...').start();

    try {
      // Use main-agent to create login page
      const result = await this.agentCaller.callAgent('main-agent', {
        task: 'Create login page with authentication system',
        context: {
          project_path: this.currentProject,
          feature_type: 'authentication',
          authentication_method: 'jwt'
        }
      });

      if (result.success) {
        spinner.succeed('Login page created successfully!');
        console.log(chalk.green('✓ Login page created by main-agent'));

        // Add TODO for review
        await this.todoManager.createTodo({
          title: 'Review login page implementation',
          description: 'Review the created login page for authentication, security, and UX',
          assigned_to: 'reviewer-agent',
          priority: 'high',
          context: {
            feature_type: 'authentication'
          }
        });
      } else {
        spinner.fail('Failed to create login page');
        console.error(chalk.red('✗ Login page creation failed:', result.error));
      }
    } catch (error) {
      spinner.fail('Login page creation failed');
      console.error(chalk.red('✗ Login page creation failed:', error.message));
    }
  }

  /**
   * Build a new feature
   */
  async buildFeature(description) {
    const spinner = ora(`Building feature: ${description.substring(0, 50)}...`).start();

    try {
      // Use task-agent for planning
      const planningResult = await this.agentCaller.callAgent('task-agent', {
        task: `Plan and breakdown: ${description}`,
        context: {
          project_path: this.currentProject,
          feature_description: description
        }
      });

      if (planningResult.success) {
        spinner.succeed('Feature planning completed');
        console.log(chalk.green('✓ Feature planned successfully'));

        // Execute implementation with coder-agent
        const tasks = planningResult.result && planningResult.result.tasks || [];

        for (const task of tasks) {
          console.log(chalk.blue(`Executing: ${task.title}`));

          const taskResult = await this.agentCaller.callAgent('coder-agent', {
            task: task.description,
            context: planningResult.result.context,
            todo_id: task.id
          });

          if (taskResult.success) {
            console.log(chalk.green(`✓ Task completed: ${task.title}`));

            await this.todoManager.updateTodoStatus(task.id, 'completed');
          } else {
            console.log(chalk.red(`✗ Task failed: ${task.title}`));
            await this.todoManager.updateTodoStatus(task.id, 'failed');
          }
        }

        // Create review TODO
        await this.todoManager.createTodo({
          title: 'Review new feature implementation',
          description: `Review the ${description} implementation for quality and best practices`,
          assigned_to: 'reviewer-agent',
          priority: 'high'
        });

        spinner.succeed('Feature build completed');
        console.log(chalk.green('✓ Feature build completed'));

      } else {
        spinner.fail('Feature planning failed');
        console.error(chalk.red('✗ Feature planning failed'));
      }
    } catch (error) {
      spinner.fail('Feature build failed');
      console.error(chalk.red('✗ Feature build failed:', error.message));
    }
  }

  /**
   * Fix a bug
   */
  async fixBug(bugDescription) {
    const spinner = ora(`Fixing bug: ${bugDescription.substring(0, 50)}...`).start();

    try {
      // Use fix-agent for debugging and resolution
      const result = await this.agentCaller.callAgent('fix-agent', {
        task: `Debug and fix: ${bugDescription}`,
        context: {
          project_path: this.currentProject,
          bug_description: bugDescription,
          error_severity: 'high'
        }
      });

      if (result.success) {
        spinner.succeed('Bug fix completed');
        console.log(chalk.green('✓ Bug fix completed'));

        // Create review TODO
        await this.todoManager.createTodo({
          title: 'Review bug fix implementation',
          description: `Review the ${bugDescription} fix for quality and correctness`,
          assigned_to: 'reviewer-agent',
          priority: 'high'
        });

        spinner.succeed('Bug fix workflow completed');
        console.log(chalk.green('✓ Bug fix completed'));

      } else {
        spinner.fail('Bug fix failed');
        console.error(chalk.red('✗ Bug fix failed'));
      }
    } catch (error) {
      spinner.fail('Bug fix failed');
      console.error(chalk.red('✗ Bug fix failed:', error.message));
    }
  }

  /**
   * Deploy application
   */
  async deploy() {
    const spinner = ora('Deploying application...').start();

    try {
      // Use deployer-agent for deployment
      const result = await this.agentCaller.callAgent('deployer-agent', {
        task: 'Deploy application to production with proper validation',
        context: {
          project_path: this.currentProject,
          deployment_type: 'production',
          environment: 'vercel'
        }
      });

      if (result.success) {
        spinner.succeed('Deployment completed');
        console.log(chalk.green('✓ Application deployed successfully'));

        await this.todoManager.createTodo({
          title: 'Monitor deployment performance',
          description: 'Monitor deployed application for performance issues and user feedback',
          assigned_to: 'deployer-agent',
          priority: 'normal'
        });

        spinner.succeed('Deployment workflow completed');
        console.log(chalk.green('✓ Deployment workflow completed'));

      } else {
        spinner.fail('Deployment failed');
        console.error(chalk.red('✗ Deployment failed'));
      }
    } catch (error) {
      spinner.fail('Deployment failed');
      console.error(chalk.red('✗ Deployment failed:', error.message));
    }
  }

  /**
   * Execute a predefined workflow
   */
  async runWorkflow(workflowName) {
    const spinner = ora(`Running ${workflowName} workflow...`).start();

    try {
      const result = await this.workflowOrchestrator.executeWorkflow(workflowName, {
        userInput: this.getWorkflowInput(workflowName),
        project_path: this.currentProject
      });

      if (result.success) {
        spinner.succeed(`${workflowName} workflow completed`);
        console.log(chalk.green(`✓ ${workflowName} completed successfully`));
        console.log(chalk.blue(`Summary: ${result.summary}`));
      } else {
        spinner.fail(`${workflowName} workflow failed`);
        console.error(chalk.red(`✗ ${workflowName} failed: ${result.error}`));
      }
    } catch (error) {
      spinner.fail(`${workflowName} workflow failed`);
      console.error(chalk.red(`✗ ${workflowName} failed: ${error.message}`));
    }
  }

  /**
   * Execute a single task
   */
  async executeTask() {
    const { command, args } = this.parseArguments(process.argv);

    if (command === 'execute-task') {
      if (!args.agent || !args.task) {
        console.error(chalk.red('Error: --execute-task requires --agent and --task arguments'));
        return;
      }

      const spinner = ora(`Executing task with ${args.agent}...`).start();

      try {
        const result = await this.agentCaller.callAgent(args.agent, {
          task: args.task,
          context: {
            project_path: this.config.paths.project || this.currentProject
          }
        });

        if (result.success) {
          spinner.succeed('Task executed successfully');
          console.log(chalk.green(`✓ Task completed: ${result.result.task}`));

          if (result.result.todo_id) {
            await this.todoManager.updateTodoStatus(result.result.todo_id, 'completed');
          }
        } else {
          spinner.fail('Task execution failed');
          console.error(chalk.red('✗ Task execution failed:', result.error));
        }
      } catch (error) {
        spinner.fail('Task execution failed');
        console.error(chalk.red('✗ Task execution failed:', error.message));
      }
    } else {
      console.error(chalk.red('Unknown command:', command));
      this.showHelp();
    }
  }

  /**
   * Get user input for workflows
   */
  getWorkflowInput(workflowName) {
    const workflow = this.workflowOrchestrator.getWorkflow(workflowName);

    if (workflow && workflow.inputs) {
      return this.promptUser(workflow.inputs, workflowName);
    }

    return {};
  }

  /**
   * Show system status and metrics
   */
  async showStatus() {
    const spinner = ora('Loading system status...').start();

    try {
      // Load full context
      const context = await this.contextLoader.loadFullContext();

      // Display summary
      console.log(chalk.blue.bold('\n📊 System Status\n'));
      console.log(chalk.cyan(`Active Workflow: ${this.workflowOrchestrator.getCurrentWorkflow() || 'None'}\n`));
      console.log(chalk.cyan(`Project: ${this.config.paths.project}\n`));

      // Display agent status
      const agentStats = await this.contextLoader.getSystemHealth();
      console.log(chalk.blue.bold('\n🤖 Agent Status\n'));

      for (const [agent, stats] of Object.entries(agentStats)) {
        if (stats) {
          console.log(chalk.blue(`  ${agent}:`));
          console.log(`    Status: ${stats.availability ? 'Available' : 'Busy'}`);
          console.log(`    Current Tasks: ${stats.current_tasks}/${stats.max_tasks}`);
          console.log(`    Success Rate: ${(stats.success_rate * 100).toFixed(1)}%`);
          console.log(`    Average Completion: ${stats.average_completion_time.toFixed(0)}min`);
        }
      }

      // Display TODO status
      const todoStats = await this.todoManager.getTodoStats();
      console.log(chalk.blue.bold('\n📋 TODO Status\n'));
      console.log(chalk.cyan(`Total: ${todoStats.total}`));
      console.log(chalk.cyan(`Pending: ${todoStats.pending}`));
      console.log(chalk.cyan(`In Progress: ${todoStats.in_progress}`));
      console.log(chalk.cyan(`Completed: ${todoStats.completed}`));

      if (todoStats.overdue > 0) {
        console.log(chalk.yellow(`⚠  Overdue: ${todoStats.overdue}`));
      }

      spinner.succeed('System status loaded');
      console.log(chalk.green('\n✨ Ready for next command\n'));

    } catch (error) {
      spinner.fail('Failed to load system status');
      console.error(chalk.red('✗ Error loading system status:', error.message));
    }
  }

  /**
   * Create project plan
   */
  async createPlan() {
    const userInput = await this.promptUser([
      {
        type: 'input',
        name: 'project_requirement',
        message: 'What is the main requirement for this project?'
      },
      {
        type: 'input',
        name: 'project_scope',
        message: 'What features and components are needed?'
      },
      {
        type: 'input',
        name: 'project_constraints',
        message: 'Are there any technical constraints or preferences?'
      },
      {
        type: 'input',
        name: 'timeline',
        message: 'What is the desired timeline or deadline?'
      }
    ]);

    const spinner = ora('Creating project plan...').start();

    try {
      // Create comprehensive planning with main-agent
      const result = await this.agentCaller.callAgent('main-agent', {
        task: 'Create comprehensive project plan for new development project',
        context: {
          project_path: this.currentProject,
          user_requirements: userInput.project_requirement,
          project_scope: userInput.project_scope,
          project_constraints: userInput.project_constraints,
          timeline: userInput.timeline
        }
      });

      if (result.success) {
        spinner.succeed('Project plan created successfully!');
        console.log(chalk.green('✓ Project plan created by main-agent'));

        // Create initial TODOs based on plan
        const todos = result.result && result.result.todos || [];
        for (const todo of todos) {
          await this.todoManager.createTodo({
            ...todo,
            assigned_to: todo.assigned_to || 'main-agent'
          });
        }

        spinner.succeed('Project planning completed');
        console.log(chalk.green(`✓ ${todos.length} TODOs created`));

      } else {
        spinner.fail('Project planning failed');
        console.error(chalk.red('✗ Project planning failed'));
      }
    } catch (error) {
      spinner.fail('Project planning failed');
      console.error(chalk.red('✗ Project planning failed:', error.message));
    }
  }

  /**
   * Manage TODOs
   */
  async manageTodos() {
    const action = await this.promptUser([
      {
        type: 'list',
        name: 'todo_action',
        message: 'What TODO action would you like to perform?'
      },
      {
        type: 'select',
        name: 'todo_filter',
        message: 'Filter by status, priority, or agent?',
        options: ['all', 'pending', 'in_progress', 'completed', 'overdue', 'high', 'medium', 'low']
      }
    ]);

    switch (action.todo_action) {
      case 'create':
        const todo = await this.promptUser([
          { type: 'input', name: 'todo_title', message: 'Task title:' },
          { type: 'input', name: 'todo_description', message: 'Task description:' },
          { type: 'input', name: 'todo_priority', message: 'Priority (low, medium, high, critical):', options: ['low', 'medium', 'high', 'critical'] },
          { type: 'input', name: 'todo_assigned_to', message: 'Assign to agent:', options: ['main-agent', 'coder-agent', 'uiux-agent', 'tester-agent', 'reviewer-agent'] }
        ]);

        if (todo) {
          await this.todoManager.createTodo({
            ...todo,
            assigned_to: todo.assigned_to
          });
        }
        break;

      case 'list':
        const todos = await this.todoManager.getTodos();
        this.displayTodos(todos, action.todo_filter);
        break;

      case 'update':
        const todosForUpdate = await this.getTodosForSelection();
        const todoId = await this.promptUser([
          { type: 'select', name: 'todo_update', message: 'Select TODO to update:', options: todosForUpdate.map(t => ({ name: t.title, value: t.id })) }
        ]);

        if (todoId) {
          const updates = await this.promptUser([
            { type: 'select', name: 'todo_status', message: 'New status for ' + todosForUpdate.find(t => t.id === todoId).title + ':', options: ['pending', 'in_progress', 'completed', 'blocked'] }
          ]);

          await this.todoManager.updateTodoStatus(todoId, updates.todo_status);
        }
        break;

      default:
        console.log(chalk.yellow('Invalid TODO action'));
    }
  }

  /**
   * Display todos with filtering
   */
  displayTodos(todos, filter = 'all') {
    let filteredTodos = todos;

    if (filter !== 'all') {
      switch (filter) {
        case 'pending':
          filteredTodos = todos.filter(t => t.status === 'pending');
          break;
        case 'in_progress':
          filteredTodos = todos.filter(t => t.status === 'in_progress');
          break;
        case 'completed':
          filteredTodos = todos.filter(t => t.status === 'completed');
          break;
        case 'overdue':
          filteredTodos = todos.filter(t => t.status === 'overdue');
          break;
        case 'high':
          filteredTodos = todos.filter(t => t.priority === 'critical');
          break;
        case 'medium':
          filteredTodos = todos.filter(t => t.priority === 'medium');
          break;
        case 'low':
          filteredTodos = todos.filter(t => t.priority === 'low');
          break;
      }
    }

    console.log(chalk.blue.bold(`\n📋 TODOs (${filteredTodos.length} total)\n`));

    if (filteredTodos.length === 0) {
      console.log(chalk.gray('  No TODOs found'));
      return;
    }

    // Group by status
    const groupedTodos = filteredTodos.reduce((groups, todo) => {
      const status = todo.status || 'no_status';
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(todo);
    }, {});

    for (const [status, color] of Object.entries(groupedTodos)) {
      console.log(chalk[color](`\n${status.charAt(0).toUpperCase() + status.slice(1)} (${groups[status].length})`));
      groups[status].forEach((todo, index) => {
        console.log(`  ${index + 1}. ${chalk.white(todo.title)} ${chalk.gray(`(${todo.id})`)} ${todo.priority ? chalk.yellow(`[${todo.priority}]`) : ''}`);
        console.log(`     ${chalk.cyan(todo.description.substring(0, 80))}...`);
      });
    }

    console.log('');
  }

  /**
   * Get todos for selection
   */
  async getTodosForSelection() {
    const todos = await this.todoManager.getTodos();
    return todos;
  }

  /**
   * Prompt user for input
   */
  async promptUser(questions) {
    const inquirer = require('inquirer');

    return await inquirer.prompt(questions);
  }

  /**
   * Start application with watch mode
   */
  async startWatch() {
    console.log(chalk.blue.bold('👀 Watching for changes...'));
    console.log(chalk.gray('Press Ctrl+C to stop\n'));

    this.isRunning = true;

    // Simple file watcher (in production, you'd use chokidar)
    const fs = require('fs');

    const watchPaths = [
      path.join(this.config.paths.docs, 'project'),
      path.join(this.config.paths.hooks, 'on-*.sh')
    ];

    for (const watchPath of watchPaths) {
      fs.watchFile(watchPath, { recursive: true }, (eventType, filename) => {
        if (this.isRunning) {
          console.log(chalk.yellow(`\n🔄 File changed: ${filename}`));

          // Trigger appropriate workflow
          this.handleFileChange(filename, eventType);
        }
      });
    }
  }

  /**
   * Handle file changes in watch mode
   */
  handleFileChange(filename, eventType) {
    console.log(chalk.blue(`\n📄 File modified: ${filename} (${eventType})`));

    // Simple pattern matching for different file types
    if (filename.includes('package.json') || filename.endsWith('.config')) {
      console.log(chalk.cyan('  → Triggering dependency check and validation...'));
    }

    if (filename.includes('src/') && (filename.endsWith('.tsx') || filename.endsWith('.ts') || filename.endsWith('.jsx'))) {
      console.log(chalk.cyan('  → Analyzing source changes...'));
    }
  }

  /**
   * Stop watching
   */
  async stopWatch() {
    this.isRunning = false;
    console.log(chalk.blue('\n👋 Stopping watch mode...\n'));
  }

  /**
   * Main execution loop
   */
  async run() {
    const { command, args } = this.parseArguments(process.argv);
    const action = this.getAction(args);

    if (!action) {
      this.showHelp();
      return;
    }

    // Execute the appropriate action
    switch (action) {
      case 'create-login-page':
        await this.createLoginPage();
        break;
      case 'build-feature':
        await this.buildFeature(args[0]);
        break;
      case 'fix-bug':
        await this.fixBug(args[0]);
        break;
      case 'deploy':
        await this.deploy();
        break;
      case 'run-workflow':
        await this.runWorkflow(args[0]);
        break;
      case 'status':
        await this.showStatus();
        break;
      case 'test-hooks':
        await this.testHooks();
        break;
      case 'plan':
        await this.createPlan();
        break;
      case 'execute-task':
        await this.executeTask();
        break;
      case 'todo':
        await this.manageTodos();
        break;
      case 'help':
        this.showHelp();
        break;
      default:
        if (!command) {
          this.showHelp();
        }
        break;
    }

    // Start with watch mode if specified
    if (args.verbose) {
      await this.startWatch();
    } else {
      await this.run();
    }
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error(chalk.red('Uncaught error:', error.message));
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n👋 Stopping gracefully...'));
  process.exit(0);
});

// Start the orchestrator
if (require.main === module) {
  const orchestrator = new ClaudeOrchestrator();
  orchestrator.run();
}

module.exports = ClaudeOrchestrator;