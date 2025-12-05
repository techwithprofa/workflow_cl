'use client';

import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { WeeklyProgress } from '@/components/dashboard/WeeklyProgress';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { TodoCard } from '@/components/todos/TodoCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TodoForm } from '@/components/todos/TodoForm';
import { useApp } from '@/contexts/AppContext';
import {
  CheckSquare,
  Clock,
  AlertCircle,
  TrendingUp,
  Plus,
  Calendar
} from 'lucide-react';
import { isDueToday, isOverdue } from '@/utils/helpers';

export default function Dashboard() {
  const { state, addTodo, updateTodo, deleteTodo } = useApp();
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Calculate quick stats
  const todayTodos = state.todos.filter(todo => isDueToday(todo));
  const overdueTodos = state.todos.filter(todo => isOverdue(todo));
  const upcomingTodos = state.todos.filter(todo => {
    const dueDate = new Date(todo.dueDate);
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate > today && dueDate <= weekFromNow && todo.status !== 'completed';
  });

  const recentTodos = state.todos
    .filter(todo => todo.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const handleAddTodo = async (formData: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      addTodo({
        title: formData.title,
        description: formData.description,
        dueDate: new Date(formData.dueDate),
        dueTime: formData.dueTime,
        priority: formData.priority,
        category: formData.category,
        tags: formData.tags,
        progress: formData.progress || 0,
        reminder: formData.reminder ? new Date(formData.reminder) : undefined,
        status: 'pending',
        subtasks: [],
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id: string, status: 'pending' | 'completed' | 'in-progress' | 'cancelled') => {
    updateTodo(id, {
      status,
      completedAt: status === 'completed' ? new Date() : undefined,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening with your todos today.
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Todo
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Tasks"
            value={state.stats.totalTodos}
            icon={CheckSquare}
            trend={{
              value: 12,
              isPositive: true,
            }}
          />
          <StatsCard
            title="Completed"
            value={state.stats.completedTodos}
            icon={CheckSquare}
            trend={{
              value: 8,
              isPositive: true,
            }}
          />
          <StatsCard
            title="Overdue"
            value={state.stats.overdueTodos}
            icon={AlertCircle}
            trend={{
              value: 3,
              isPositive: false,
            }}
          />
          <StatsCard
            title="Completion Rate"
            value={state.stats.completionRate}
            icon={TrendingUp}
            trend={{
              value: 5,
              isPositive: true,
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Progress */}
          <div className="lg:col-span-2">
            <WeeklyProgress data={state.stats.weeklyProgress} />
          </div>

          {/* Category Chart */}
          <CategoryChart data={state.stats.categoryStats} total={state.stats.totalTodos} />
        </div>

        {/* Quick Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Tasks */}
          <div className="bg-background border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Today's Tasks</h3>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">{todayTodos.length}</div>
            <p className="text-muted-foreground text-sm mb-4">
              {todayTodos.filter(t => t.status === 'completed').length} completed today
            </p>
            {todayTodos.length > 0 && (
              <div className="space-y-2">
                {todayTodos.slice(0, 3).map(todo => (
                  <div key={todo.id} className="text-sm">
                    <span className={todo.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                      {todo.title}
                    </span>
                  </div>
                ))}
                {todayTodos.length > 3 && (
                  <div className="text-sm text-muted-foreground">
                    +{todayTodos.length - 3} more tasks
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Overdue Tasks */}
          <div className="bg-background border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Overdue Tasks</h3>
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div className="text-3xl font-bold text-destructive mb-2">{overdueTodos.length}</div>
            <p className="text-muted-foreground text-sm mb-4">
              Tasks that need immediate attention
            </p>
            {overdueTodos.length > 0 && (
              <Button variant="outline" size="sm" className="w-full">
                <Clock className="h-4 w-4 mr-2" />
                Review Overdue Tasks
              </Button>
            )}
          </div>
        </div>

        {/* Recent Tasks */}
        {recentTodos.length > 0 && (
          <div className="bg-background border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Upcoming Tasks</h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTodos.map(todo => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onEdit={(todo) => {
                    // Handle edit - would need edit modal
                  }}
                  onDelete={deleteTodo}
                  onStatusChange={handleStatusChange}
                  compact
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Todo Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Todo"
        size="lg"
      >
        <TodoForm
          onSubmit={handleAddTodo}
          onCancel={() => setShowAddModal(false)}
          isLoading={loading}
        />
      </Modal>
    </Layout>
  );
}
