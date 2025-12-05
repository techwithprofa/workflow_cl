const fs = require('fs-extra');
const path = require('path');

class TodoManager {
  constructor(config) {
    this.config = config;
    this.todoPath = path.join(config.paths.docs, 'todo', 'project.json');
  }

  /**
   * Create a new TODO item
   */
  async createTodo(todoData) {
    try {
      const currentData = await this.loadTodos();

      const newTodo = {
        id: `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: todoData.title,
        description: todoData.description,
        status: 'pending',
        priority: todoData.priority || 'normal',
        assigned_to: todoData.assigned_to || null,
        created_by: todoData.created_by || 'main-agent',
        created_at: new Date().toISOString(),
        due_date: todoData.due_date || null,
        estimated_hours: todoData.estimated_hours || 0,
        dependencies: todoData.dependencies || [],
        tags: todoData.tags || [],
        context: todoData.context || {}
      };

      currentData.todos.push(newTodo);

      // Sort by priority and due date
      currentData.todos.sort((a, b) => {
        const priorityOrder = { 'critical': 4, 'high': 3, 'normal': 2, 'low': 1 };
        const dateA = new Date(a.due_date || '9999-12-31');
        const dateB = new Date(b.due_date || '9999-12-31');

        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return 1;
        }
        if (priorityOrder[a.priority] === priorityOrder[b.priority]) {
          return dateB - dateA;
        }
        return dateA - dateB;
      });

      await this.saveTodos(currentData);

      return {
        success: true,
        todo: newTodo,
        message: `TODO created: ${newTodo.title}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to create TODO: ${error.message}`
      };
    }
  }

  /**
   * Update a TODO item
   */
  async updateTodo(todoId, updates) {
    try {
      const currentData = await this.loadTodos();
      const todoIndex = currentData.todos.findIndex(t => t.id === todoId);

      if (todoIndex === -1) {
        return {
          success: false,
          error: `TODO not found: ${todoId}`,
          message: 'TODO item not found in system'
        };
      }

      // Update the TODO
      Object.assign(currentData.todos[todoIndex], updates);
      currentData.todos[todoIndex].updated_at = new Date().toISOString();

      await this.saveTodos(currentData);

      return {
        success: true,
        todo: currentData.todos[todoIndex],
        message: `TODO updated: ${currentData.todos[todoIndex].title}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to update TODO ${todoId}: ${error.message}`
      };
    }
  }

  /**
   * Update TODO status
   */
  async updateTodoStatus(todoId, status) {
    return await this.updateTodo(todoId, { status });
  }

  /**
   * Assign TODO to agent
   */
  async assignTodo(todoId, agent) {
    return await this.updateTodo(todoId, {
      assigned_to: agent,
      status: 'in_progress',
      started_at: new Date().toISOString()
    });
  }

  /**
   * Add TODO progress
   */
  async addTodoProgress(todoId, progress) {
    return await this.updateTodo(todoId, {
      progress: Math.max(0, Math.min(100, (current || 0) + progress)),
      progress_percentage: Math.max(0, Math.min(100, (current || 0) + progress))
    });
  }

  /**
   * Complete TODO and move to review
   */
  async completeTodo(todoId) {
    return await this.updateTodo(todoId, {
      status: 'completed',
      completed_at: new Date().toISOString(),
      progress: 100,
      progress_percentage: 100
    });
  }

  /**
   * Mark TODO as blocked
   */
  async blockTodo(todoId, reason) {
    return await this.updateTodo(todoId, {
      status: 'blocked',
      blocked_reason: reason,
      blocked_at: new Date().toISOString()
    });
  }

  /**
   * Mark TODO as done (after approval)
   */
  async doneTodo(todoId) {
    return await this.updateTodo(todoId, {
      status: 'done',
      completed_at: new Date().toISOString(),
      progress: 100,
      progress_percentage: 100
    });
  }

  /**
   * Get TODOs by status
   */
  async getTodosByStatus(status) {
    const data = await this.loadTodos();
    return data.todos.filter(todo => todo.status === status);
  }

  /**
   * Get TODOs by agent
   */
  async getTodosByAgent(agent) {
    const data = await this.loadTodos();
    return data.todos.filter(todo => todo.assigned_to === agent);
  }

  /**
   * Get overdue TODOs
   */
  async getOverdueTodos() {
    const data = await this.loadTodos();
    const now = new Date();

    return data.todos.filter(todo => {
      todo.due_date && new Date(todo.due_date) < now
    });
  }

  /**
   * Save TODO data to file
   */
  async saveTodos(data) {
    try {
      // Create backup
      if (fs.existsSync(this.todoPath)) {
        const backupPath = this.todoPath + '.backup.' + Date.now();
        fs.copySync(this.todoPath, backupPath);
      }

      // Save with atomic operation
      fs.writeJsonSync(this.todoPath, data, { spaces: 2 });

      // Clean up old backups (keep last 10)
      const files = fs.readdirSync(path.dirname(this.todoPath))
        .filter(file => file.startsWith('project.json.backup.'))
        .sort()
        .slice(0, -10); // Keep only 10 most recent

      for (const file of files) {
        fs.unlinkSync(path.join(path.dirname(this.todoPath), file));
      }

      return {
        success: true,
        message: `Saved ${data.todos.length} TODOs`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to save TODOs: ${error.message}`
      };
    }
  }

  /**
   * Load all TODOs
   */
  async loadTodos() {
    try {
      if (fs.existsSync(this.todoPath)) {
        return fs.readJsonSync(this.todoPath);
      } else {
        return {
          todos: [],
          metadata: {
            total_todos: 0,
            created_todos: 0,
            completed_todos: 0,
            in_progress_todos: 0,
            blocked_todos: 0,
            overdue_todos: 0,
            last_updated: new Date().toISOString()
          }
        };
      }
    } catch (error) {
      console.error('Error loading TODOs:', error.message);
      return {
        todos: [],
        metadata: {
          total_todos: 0,
          created_todos: 0,
          completed_todos: 0,
          in_progress_todos: 0,
          blocked_todos: 0,
          overdue_todos: 0,
          last_updated: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Get TODO statistics
   */
  async getTodoStats() {
    const data = await this.loadTodos();
    const stats = {
      total: data.todos.length,
      by_status: {
        pending: data.todos.filter(t => t.status === 'pending').length,
        in_progress: data.todos.filter(t => t.status === 'in_progress').length,
        completed: data.todos.filter(t => t.status === 'completed').length,
        blocked: data.todos.filter(t => t.status === 'blocked').length,
        done: data.todos.filter(t => t.status === 'done').length
      },
      by_priority: {
        critical: data.todos.filter(t => t.priority === 'critical').length,
        high: data.todos.filter(t => t.priority === 'high').length,
        normal: data.todos.filter(t => t.priority === 'normal').length,
        low: data.todos.filter(t => t.priority === 'low').length
      },
      by_agent: {}
    };

    // Count by agent
    for (const todo of data.todos) {
      const agent = todo.assigned_to || 'unassigned';
      stats.by_agent[agent] = (stats.by_agent[agent] || 0) + 1;
    }

    stats.overdue_todos = data.todos.filter(t => todo.due_date && new Date(todo.due_date) < new Date()).length;

    return stats;
  }
}

module.exports = TodoManager;