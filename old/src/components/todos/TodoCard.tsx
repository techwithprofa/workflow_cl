'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Tag, MoreVertical, CheckCircle2, Circle, AlertCircle, XCircle } from 'lucide-react';
import { Todo } from '@/types';
import { cn } from '@/utils/helpers';
import { PRIORITY_COLORS, PRIORITY_ICONS, CATEGORY_COLORS, CATEGORY_ICONS } from '@/utils/constants';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import * as Icons from 'lucide-react';

interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Todo['status']) => void;
  compact?: boolean;
  draggable?: boolean;
}

export function TodoCard({ todo, onEdit, onDelete, onStatusChange, compact = false, draggable = false }: TodoCardProps) {
  const [showActions, setShowActions] = useState(false);

  // Simplified icon handling - will be enhanced later
  const getPriorityIcon = () => {
    switch (todo.priority) {
      case 'urgent': return <AlertCircle className="h-3 w-3" />;
      case 'high': return <AlertCircle className="h-3 w-3" />;
      case 'medium': return <Circle className="h-3 w-3" />;
      case 'low': return <Circle className="h-3 w-3" />;
      default: return <Circle className="h-3 w-3" />;
    }
  };

  const statusIcon = {
    pending: <Circle className="h-4 w-4" />,
    'in-progress': <AlertCircle className="h-4 w-4" />,
    completed: <CheckCircle2 className="h-4 w-4" />,
    cancelled: <XCircle className="h-4 w-4" />,
  }[todo.status];

  const isOverdue = todo.status !== 'completed' && new Date(todo.dueDate) < new Date();

  return (
    <div
      className={cn(
        'bg-background border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200',
        compact ? 'p-3' : 'p-4',
        todo.status === 'completed' && 'opacity-60',
        isOverdue && 'border-destructive/50 bg-destructive/5',
        draggable && 'cursor-move hover:shadow-lg'
      )}
      onClick={() => onEdit(todo)}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Status */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const nextStatus = todo.status === 'completed' ? 'pending' : 'completed';
                onStatusChange(todo.id, nextStatus);
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {statusIcon}
            </button>
            <h3 className={cn(
              'font-medium text-foreground truncate',
              todo.status === 'completed' && 'line-through'
            )}>
              {todo.title}
            </h3>
          </div>

          {/* Description */}
          {todo.description && !compact && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {todo.description}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {/* Due Date */}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span className={cn(
                isOverdue && 'text-destructive font-medium'
              )}>
                {format(new Date(todo.dueDate), 'MMM d, yyyy')}
              </span>
            </div>

            {/* Due Time */}
            {todo.dueTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{todo.dueTime}</span>
              </div>
            )}

            {/* Priority */}
            <div className="flex items-center gap-1">
              {getPriorityIcon()}
              <span className="capitalize">{todo.priority}</span>
            </div>

            {/* Progress */}
            {todo.subtasks.length > 0 && (
              <div className="flex items-center gap-1">
                <span>{todo.subtasks.filter(st => st.completed).length}/{todo.subtasks.length}</span>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {/* Category Badge */}
            <Badge className={CATEGORY_COLORS[todo.category]}>
              <Tag className="h-3 w-3 mr-1" />
              {todo.category}
            </Badge>

            {/* Priority Badge */}
            <Badge className={PRIORITY_COLORS[todo.priority]}>
              {getPriorityIcon()}
              <span className="ml-1">{todo.priority}</span>
            </Badge>

            {/* Status Badge */}
            <Badge variant="outline" className="capitalize">
              {todo.status.replace('-', ' ')}
            </Badge>

            {/* Tags */}
            {todo.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>

          {/* Progress Bar */}
          {todo.subtasks.length > 0 && (
            <div className="mt-3">
              <div className="w-full bg-secondary rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${(todo.subtasks.filter(st => st.completed).length / todo.subtasks.length) * 100}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>

          {showActions && (
            <div className="absolute right-0 top-8 bg-background border rounded-md shadow-lg z-10 py-1 min-w-32">
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(todo);
                  setShowActions(false);
                }}
              >
                Edit
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(todo.id);
                  setShowActions(false);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}