'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X, Plus, Trash2, Calendar, Clock, Tag } from 'lucide-react';
import { Todo, TodoFormData, Category, Priority } from '@/types';
import { CATEGORIES, PRIORITIES } from '@/utils/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { generateId } from '@/utils/helpers';

interface TodoFormProps {
  todo?: Todo;
  onSubmit: (data: TodoFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TodoForm({ todo, onSubmit, onCancel, isLoading = false }: TodoFormProps) {
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    dueTime: '',
    priority: 'medium',
    category: 'personal',
    tags: [],
    progress: 0,
    reminder: '',
  });

  const [newTag, setNewTag] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description || '',
        dueDate: format(new Date(todo.dueDate), 'yyyy-MM-dd'),
        dueTime: todo.dueTime || '',
        priority: todo.priority,
        category: todo.category,
        tags: todo.tags,
        progress: todo.progress,
        reminder: todo.reminder ? format(new Date(todo.reminder), "yyyy-MM-dd'T'HH:mm") : '',
      });
    }
  }, [todo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      // This would be handled in the parent component for subtasks
      setNewSubtask('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Title <span className="text-destructive">*</span>
        </label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter todo title..."
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Description
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter todo description..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Due Date <span className="text-destructive">*</span>
          </label>
          <Input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            required
          />
        </div>

        {/* Due Time */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <Clock className="inline h-4 w-4 mr-1" />
            Due Time
          </label>
          <Input
            type="time"
            value={formData.dueTime}
            onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Priority */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Priority
          </label>
          <Select
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Priority }))}
          >
            {PRIORITIES.map(priority => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </Select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Category
          </label>
          <Select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Category }))}
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-2">
          <Tag className="inline h-4 w-4 mr-1" />
          Tags
        </label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="cursor-pointer">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Progress ({formData.progress}%)
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={formData.progress}
          onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
          className="w-full"
        />
      </div>

      {/* Reminder */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Reminder Date & Time
        </label>
        <Input
          type="datetime-local"
          value={formData.reminder}
          onChange={(e) => setFormData(prev => ({ ...prev, reminder: e.target.value }))}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !formData.title.trim()}
        >
          {isLoading ? 'Saving...' : todo ? 'Update Todo' : 'Create Todo'}
        </Button>
      </div>
    </form>
  );
}