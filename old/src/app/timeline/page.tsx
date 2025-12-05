'use client';

import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { TimelineView } from '@/components/timeline/TimelineView';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TodoForm } from '@/components/todos/TodoForm';
import { useApp } from '@/contexts/AppContext';
import { Plus } from 'lucide-react';

export default function TimelinePage() {
  const { addTodo } = useApp();
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Timeline</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your tasks in a timeline format.
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Todo
          </Button>
        </div>

        {/* Timeline View */}
        <TimelineView />

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
      </div>
    </Layout>
  );
}