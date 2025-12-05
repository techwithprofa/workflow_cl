'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { TodoCard } from '@/components/todos/TodoCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TodoForm } from '@/components/todos/TodoForm';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/contexts/AppContext';
import { Todo, Category, Priority, TodoStatus } from '@/types';
import { CATEGORIES, PRIORITIES, STATUSES } from '@/utils/constants';
import {
  Plus,
  Search,
  Filter,
  SortAsc,
  Grid,
  List,
  X
} from 'lucide-react';

export default function TasksPage() {
  const { state, addTodo, updateTodo, deleteTodo, setFilters, filteredTodos } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('dueDate');

  // Local filter state for immediate UI updates
  const [localFilters, setLocalFilters] = useState({
    search: state.filter.search,
    category: state.filter.category,
    priority: state.filter.priority,
    status: state.filter.status,
  });

  const handleAddTodo = async (formData: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
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

  const handleEditTodo = async (formData: any) => {
    if (!editingTodo) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      updateTodo(editingTodo.id, {
        title: formData.title,
        description: formData.description,
        dueDate: new Date(formData.dueDate),
        dueTime: formData.dueTime,
        priority: formData.priority,
        category: formData.category,
        tags: formData.tags,
        progress: formData.progress || 0,
        reminder: formData.reminder ? new Date(formData.reminder) : undefined,
      });
      setShowEditModal(false);
      setEditingTodo(null);
    } catch (error) {
      console.error('Error updating todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    setFilters(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      search: '',
      category: 'all' as const,
      priority: 'all' as const,
      status: 'all' as const,
    };
    setLocalFilters(defaultFilters);
    setFilters(defaultFilters);
  };

  const openEditModal = (todo: any) => {
    setEditingTodo(todo);
    setShowEditModal(true);
  };

  const getSortedTodos = () => {
    return [...filteredTodos].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const sortedTodos = getSortedTodos();
  const hasActiveFilters = localFilters.search || localFilters.category !== 'all' || localFilters.priority !== 'all' || localFilters.status !== 'all';

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">All Tasks</h1>
            <p className="text-muted-foreground mt-1">
              Manage and organize all your tasks in one place.
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Filters and Controls */}
        <div className="bg-background border rounded-lg p-4 space-y-4">
          {/* Search and Quick Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-10"
                  value={localFilters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select
                value={localFilters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </Select>

              <Select
                value={localFilters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <option value="all">All Priorities</option>
                {PRIORITIES.map(priority => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </Select>

              <Select
                value={localFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Status</option>
                {STATUSES.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </Select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          {/* Sorting and View Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="created">Created</option>
                <option value="title">Title</option>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {sortedTodos.length} {sortedTodos.length === 1 ? 'task' : 'tasks'}
              </span>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks List/Grid */}
        {sortedTodos.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-4'
          }>
            {sortedTodos.map(todo => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onEdit={openEditModal}
                onDelete={deleteTodo}
                onStatusChange={(id, status) => updateTodo(id, { status, completedAt: status === 'completed' ? new Date() : undefined })}
                compact={viewMode === 'list'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-muted/50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {hasActiveFilters ? 'No tasks match your filters' : 'No tasks yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {hasActiveFilters
                ? 'Try adjusting your filters or add some new tasks to get started.'
                : 'Create your first task to get started with managing your todos.'
              }
            </p>
            {!hasActiveFilters && (
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Task
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add Todo Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Task"
        size="lg"
      >
        <TodoForm
          onSubmit={handleAddTodo}
          onCancel={() => setShowAddModal(false)}
          isLoading={loading}
        />
      </Modal>

      {/* Edit Todo Modal */}
      <Modal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTodo(null);
        }}
        title="Edit Task"
        size="lg"
      >
        {editingTodo && (
          <TodoForm
            todo={editingTodo}
            onSubmit={handleEditTodo}
            onCancel={() => {
              setShowEditModal(false);
              setEditingTodo(null);
            }}
            isLoading={loading}
          />
        )}
      </Modal>
    </Layout>
  );
}