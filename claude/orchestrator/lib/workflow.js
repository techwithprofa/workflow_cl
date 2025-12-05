const AgentCaller = require('./agent-caller');
const ContextLoader = require('./context-loader');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const moment = require('moment');

class WorkflowOrchestrator {
  constructor(config) {
    this.config = config;
    this.agentCaller = new AgentCaller(config);
    this.contextLoader = new ContextLoader(config);
    this.workflows = config.workflows;
    this.limits = config.limits;
    this.logging = config.logging;
  }

  /**
   * Execute a complete workflow from start to finish
   */
  async executeWorkflow(workflowName, userInput = {}, overrides = {}) {
    const spinner = ora(`Starting ${workflowName} workflow...`).start();

    try {
      const workflow = this.workflows[workflowName];
      if (!workflow) {
        throw new Error(`Workflow ${workflowName} not found`);
      }

      // Load full context
      const context = await this.contextLoader.loadFullContext();

      // Initialize workflow state
      const workflowState = {
        name: workflow.name,
        description: workflow.description,
        startTime: Date.now(),
        userInput,
        currentStep: 0,
        totalSteps: workflow.steps.length,
        completedSteps: [],
        failed: [],
        context: context,
        state: 'running',
        results: {}
      };

      // Execute each step in the workflow
      for (let i = 0; i < workflow.steps.length; i++) {
        const step = workflow.steps[i];
        workflowState.currentStep = i + 1;

        spinner.text = `Step ${i + 1}/${workflow.totalSteps}: ${step}`;

        try {
          const result = await this.executeStep(step, workflowState, overrides);
          workflowState.completedSteps.push({
            step: i + 1,
            name: step,
            success: true,
            result: result,
            duration: result.duration
          });

          workflowState.results[i + 1] = result;
        } catch (error) {
          workflowState.failed.push({
            step: i + 1,
            name: step,
            success: false,
            error: error.message,
            duration: 0
          });

          workflowState.results[i + 1] = {
            success: false,
            error: error.message
          };
        }
      }

      spinner.succeed(`Completed ${workflowName} workflow`);
      workflowState.state = 'completed';
      workflowState.endTime = Date.now();
      workflowState.totalDuration = workflowState.endTime - workflowState.startTime;

      // Save workflow results
      await this.saveWorkflowResults(workflowState);

      return workflowState;
    } catch (error) {
      spinner.fail(`Failed ${workflowName} workflow: ${error.message}`);
      throw error;
    }
  }

  /**
   * Execute a single workflow step
   */
  async executeStep(step, workflowState, overrides = {}) {
    const startTime = Date.now();

    // Apply overrides if provided
    const stepConfig = { ...step, ...overrides[step] };

    switch (step) {
      case 'planning':
        return await this.executePlanningStep(stepConfig, workflowState);

      case 'implementation':
        return await this.executeImplementationStep(stepConfig, workflowState);

      case 'testing':
        return await this.executeTestingStep(stepConfig, workflowState);

      case 'review':
        return await this.executeReviewStep(stepConfig, workflowState);

      case 'documentation':
        return await this.executeDocumentationStep(stepConfig, workflowState);

      case 'deployment':
        return await this.executeDeploymentStep(stepConfig, workflowState);

      default:
        return await this.executeGenericStep(stepConfig, workflowState);
    }
  }

  /**
   * Execute planning step
   */
  async executePlanningStep(step, workflowState) {
    const spinner = ora('Planning workflow step...').start();

    try {
      // Call main-agent for planning
      const planningTask = {
        task: workflowState.userInput,
        context: workflowState.context,
        workflow: workflowState.name,
        step: 'planning'
      };

      const result = await this.agentCaller.callAgent('main-agent', planningTask, workflowState.context);

      const duration = Date.now() - Date.now();

      spinner.succeed('Planning step completed');

      return {
        success: result.success,
        result: result.result,
        duration,
        agent: 'main-agent'
      };
    } catch (error) {
      spinner.fail('Planning step failed');
      throw error;
    }
  }

  /**
   * Execute implementation step
   */
  async executeImplementationStep(step, workflowState) {
    const spinner = ora('Executing implementation step...').start();

    try {
      // Determine which agent to use based on task type
      const agentType = this.determineAgentForTask(workflowState.userInput, workflowState);

      const implementationTask = {
        task: workflowState.userInput,
        context: workflowState.context,
        workflow: workflowState.name,
        step: 'implementation',
        agent: agentType
      };

      const result = await this.agentCaller.callAgent(agentType, implementationTask, workflowState.context);

      const duration = Date.now() - Date.now();

      spinner.succeed('Implementation step completed');

      return {
        success: result.success,
        result: result.result,
        duration,
        agent: agentType
      };
    } catch (error) {
      spinner.fail('Implementation step failed');
      throw error;
    }
  }

  /**
   * Execute testing step
   */
  async executeTestingStep(step, workflowState) {
    const spinner = ora('Running testing step...').start();

    try {
      const testingTask = {
        task: workflowState.userInput,
        context: workflowState.context,
        workflow: workflowState.name,
        step: 'testing',
        type: 'comprehensive'
      };

      // Call tester-agent for comprehensive testing
      const result = await this.agentCaller.callAgent('tester-agent', testingTask, workflowState.context);

      const duration = Date.now() - Date.now();

      spinner.succeed('Testing step completed');

      return {
        success: result.success,
        result: result.result,
        duration,
        agent: 'tester-agent'
      };
    } catch (error) {
      spinner.fail('Testing step failed');
      throw error;
    }
  }

  /**
   * Execute review step
   */
  async executeReviewStep(step, workflowState) {
    const spinner = ora('Running review step...').start();

    try {
      // Use reviewer-agent for code review
      const reviewTask = {
        task: workflowState.userInput,
        context: workflowState.context,
        workflow: workflowState.name,
        step: 'review'
      };

      const result = await this.agentCaller.callAgent('reviewer-agent', reviewTask, workflowState.context);

      const duration = Date.now() - Date.now();

      spinner.succeed('Review step completed');

      return {
        success: result.success,
        result: result.result,
        duration,
        agent: 'reviewer-agent'
      };
    } catch (error) {
      spinner.fail('Review step failed');
      throw error;
    }
  }

  /**
   * Execute documentation step
   */
  async executeDocumentationStep(step, workflowState) {
    const spinner = ora('Creating documentation...').start();

    try {
      const documentationTask = {
        task: workflowState.userInput,
        context: workflowState.context,
        workflow: workflowState.name,
        step: 'documentation'
      };

      // Use documenter-agent for documentation creation
      const result = await this.agentCaller.callAgent('documenter-agent', documentationTask, workflowState.context);

      const duration = Date.now() - Date.now();

      spinner.succeed('Documentation step completed');

      return {
        success: result.success,
        result: result.result,
        duration,
        agent: 'documenter-agent'
      };
    } catch (error) {
      spinner.fail('Documentation step failed');
      throw error;
    }
  }

  /**
   * Execute deployment step
   */
  async executeDeploymentStep(step, workflowState) {
    const spinner = ora('Deploying application...').start();

    try {
      const deploymentTask = {
        task: workflowState.userInput,
        context: workflowState.context,
        workflow: workflowState.name,
        step: 'deployment'
      };

      // Use deployer-agent for deployment
      const result = await this.agentCaller.callAgent('deployer-agent', deploymentTask, workflowState.context);

      const duration = Date.now() - Date.now();

      spinner.succeed('Deployment step completed');

      return {
        success: result.success,
        result: result.result,
        duration,
        agent: 'deployer-agent'
      };
    } catch (error) {
      spinner.fail('Deployment step failed');
      throw error;
    }
  }

  /**
   * Execute generic step for any specialized workflow
   */
  async executeGenericStep(step, workflowState) {
    const spinner = ora(`Executing ${step} step...`).start();

    try {
      const agent = step.agent || this.determineAgentForTask(workflowState.userInput, workflowState);
      const task = {
        task: workflowState.userInput,
        context: workflowState.context,
        workflow: workflowState.name,
        step: step
      };

      const result = await this.agentCaller.callAgent(agent, task, workflowState.context);

      const duration = Date.now() - Date.now();

      spinner.succeed(`${step} step completed`);

      return {
        success: result.success,
        result: result.result,
        duration,
        agent
      };
    } catch (error) {
      spinner.fail(`${step} step failed`);
      throw error;
    }
  }

  /**
   * Determine the best agent for a given task
   */
  determineAgentForTask(userInput, workflowState) {
    // Simple task type detection
    const input = userInput.toLowerCase();

    // Check for specific keywords
    if (input.includes('bug') || input.includes('fix') || input.includes('error') || input.includes('debug')) {
      return 'fix-agent';
    } else if (input.includes('test') || input.includes('verify') || input.includes('validate')) {
      return 'tester-agent';
    } else if (input.includes('review') || input.includes('approve') || input.includes('audit')) {
      return 'reviewer-agent';
    } else if (input.includes('deploy') || input.includes('release') || input.includes('publish')) {
      return 'deployer-agent';
    } else if (input.includes('design') || input.includes('ui') || input.includes('ux') || input.includes('frontend')) {
      return 'uiux-agent';
    } else if (input.includes('doc') || input.includes('readme') || input.includes('guide')) {
      return 'documenter-agent';
    } else if (input.includes('plan') || input.includes('architect') || input.includes('structure')) {
      return 'main-agent'; // Planning goes to main agent
    } else {
      return 'coder-agent'; // Default to coder for implementation
    }
  }

  /**
   * Save workflow execution results
   */
  async saveWorkflowResults(workflowState) {
    const resultsDir = path.join(this.config.paths.docs, 'workflows');
    fs.ensureDirSync(resultsDir);

    const timestamp = moment().format('YYYY-MM-DD-HHmmss');
    const resultFile = path.join(resultsDir, `${workflowState.name}-${timestamp}.json`);

    const results = {
      workflow: workflowState.name,
      description: workflowState.description,
      startTime: workflowState.startTime,
      endTime: workflowState.endTime,
      totalDuration: workflowState.totalDuration,
      state: workflowState.state,
      steps: workflowState.totalSteps,
      completedSteps: workflowState.completedSteps,
      failed: workflowState.failed,
      results: workflowState.results,
      context: {
        timestamp: workflowState.timestamp,
        project: workflowState.context.project
      }
    };

    fs.writeJsonSync(resultFile, results, { spaces: 2 });

    // Update workflow history
    const historyFile = path.join(resultsDir, 'workflow-history.json');
    let history = [];

    if (fs.existsSync(historyFile)) {
      history = fs.readJsonSync(historyFile);
    }

    history.push({
      workflow: workflowState.name,
      timestamp: timestamp,
      duration: workflowState.totalDuration,
      success: workflowState.state === 'completed'
    });

    fs.writeJsonSync(historyFile, history, { spaces: 2 });

    this.log('info', `Workflow ${workflowState.name} completed in ${workflowState.totalDuration}ms`, {
      workflow: workflowState.name,
      duration: workflowState.totalDuration,
      completedSteps: workflowState.completedSteps.length,
      totalSteps: workflowState.totalSteps
    });
  }

  /**
   * Log workflow events
   */
  log(level, message, meta = {}) {
    if (this.logging.enabled) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        level: level,
        message,
        meta,
        module: 'WorkflowOrchestrator'
      };

      if (level === 'error') {
        console.error(chalk.red(`[ERROR] ${message}`));
      } else if (level === 'warn') {
        console.warn(chalk.yellow(`[WARN] ${message}`));
      } else {
        console.log(chalk.green(`[INFO] ${message}`));
      }
    }
  }

  /**
   * Get available workflows
   */
  getAvailableWorkflows() {
    return Object.keys(this.workflows);
  }

  /**
   * Get workflow definition
   */
  getWorkflow(workflowName) {
    return this.workflows[workflowName];
  }
}

module.exports = WorkflowOrchestrator;